import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import AppContext from '../context/AppContext';

const GRID_W = 20;
const GRID_H = 13;

const initialSnake = [
  { x: 5, y: 6 },
  { x: 4, y: 6 },
  { x: 3, y: 6 },
];

const randomApple = (snake) => {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID_W), y: Math.floor(Math.random() * GRID_H) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
};

const SnakeGame = ({ onEarnCoins, coins, standalone = false }) => {
  const { langConfig, lang } = useContext(AppContext);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [snakeLength, setSnakeLength] = useState(3);
  const [highScore, setHighScore] = useState(() => {
    try { return Number(localStorage.getItem('snake_high') || 0); } catch { return 0; }
  });
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(standalone);
  const [canvasSize, setCanvasSize] = useState({ w: 300, h: 195 });

  const snakeRef = useRef([...initialSnake.map(s => ({ ...s }))]);
  const appleRef = useRef(randomApple(initialSnake));
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const dirChangedRef = useRef(false);
  const scoreRef = useRef(0);
  const gameStateRef = useRef('idle');
  const gameLoopRef = useRef(null);
  const touchStartRef = useRef(null);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const getCellSize = useCallback(() => {
    if (!containerRef.current) return 14;
    const containerWidth = containerRef.current.offsetWidth - 16;
    return Math.floor(Math.min(containerWidth / GRID_W, 18));
  }, []);

  useEffect(() => {
    if (!isModalOpen && !standalone) return;
    const updateSize = () => {
      if (!containerRef.current) return;
      const cw = Math.min(containerRef.current.clientWidth - 20, 360);
      const cell = Math.floor(cw / GRID_W);
      setCanvasSize({ w: GRID_W * cell, h: GRID_H * cell });
    };
    const timer = setTimeout(updateSize, 50);
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, [isModalOpen, standalone]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cellW = canvas.width / GRID_W;
    const cellH = canvas.height / GRID_H;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < GRID_W; x++) {
      for (let y = 0; y < GRID_H; y++) {
        ctx.strokeRect(x * cellW, y * cellH, cellW, cellH);
      }
    }

    const apple = appleRef.current;
    ctx.save();
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(apple.x * cellW + cellW / 2, apple.y * cellH + cellH / 2, Math.min(cellW, cellH) / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.ellipse(apple.x * cellW + cellW / 2 + 2, apple.y * cellH + 2, 3, 2, 0.5, 0, Math.PI * 2);
    ctx.fill();

    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const ratio = 1 - (i / snake.length) * 0.6;
      ctx.save();
      if (i === 0) {
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#FFD700';
      } else {
        ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
        ctx.shadowBlur = 3;
        const r = Math.round(212 * ratio);
        const g = Math.round(175 * ratio);
        const b = Math.round(55 * ratio);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      }
      const pad = i === 0 ? 0.5 : 1.5;
      const radius = i === 0 ? 5 : 3;
      ctx.beginPath();
      ctx.roundRect(seg.x * cellW + pad, seg.y * cellH + pad, cellW - pad * 2, cellH - pad * 2, radius);
      ctx.fill();
      ctx.restore();
    });

    const head = snake[0];
    const dir = dirRef.current;
    ctx.fillStyle = '#111';
    const eyeR = Math.max(1.5, cellW * 0.1);
    const cx = head.x * cellW + cellW / 2;
    const cy = head.y * cellH + cellH / 2;
    let e1x, e1y, e2x, e2y;
    if (dir.x === 1) { e1x = cx + cellW * 0.2; e1y = cy - cellH * 0.2; e2x = cx + cellW * 0.2; e2y = cy + cellH * 0.2; }
    else if (dir.x === -1) { e1x = cx - cellW * 0.2; e1y = cy - cellH * 0.2; e2x = cx - cellW * 0.2; e2y = cy + cellH * 0.2; }
    else if (dir.y === -1) { e1x = cx - cellW * 0.2; e1y = cy - cellH * 0.2; e2x = cx + cellW * 0.2; e2y = cy - cellH * 0.2; }
    else { e1x = cx - cellW * 0.2; e1y = cy + cellH * 0.2; e2x = cx + cellW * 0.2; e2y = cy + cellH * 0.2; }
    ctx.beginPath(); ctx.arc(e1x, e1y, eyeR, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(e2x, e2y, eyeR, 0, Math.PI * 2); ctx.fill();
  }, []);

  const gameStep = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    const snake = snakeRef.current;
    dirRef.current = { ...nextDirRef.current };
    dirChangedRef.current = false;
    const dir = dirRef.current;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
      setGameState('gameover'); return;
    }
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        setGameState('gameover'); return;
      }
    }

    const newSnake = [head, ...snake];
    const apple = appleRef.current;

    if (head.x === apple.x && head.y === apple.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setSnakeLength(newSnake.length);
      appleRef.current = randomApple(newSnake);
      if (window.navigator.vibrate) window.navigator.vibrate(30);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    drawGame();
  }, [drawGame]);

  const startGame = useCallback(() => {
    snakeRef.current = initialSnake.map(s => ({ ...s }));
    appleRef.current = randomApple(initialSnake);
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    dirChangedRef.current = false;
    scoreRef.current = 0;
    setScore(0);
    setSnakeLength(3);
    setCoinsEarned(0);
    setGameState('playing');
    setTimeout(() => drawGame(), 50);
  }, [drawGame]);

  const changeDir = useCallback((newDir) => {
    if (dirChangedRef.current) return;
    const dir = dirRef.current;
    if (newDir.x !== 0 && newDir.x === -dir.x) return;
    if (newDir.y !== 0 && newDir.y === -dir.y) return;
    nextDirRef.current = newDir;
    dirChangedRef.current = true;
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      const speed = Math.max(120, 250 - snakeRef.current.length * 4);
      gameLoopRef.current = setInterval(gameStep, speed);
    } else {
      clearInterval(gameLoopRef.current);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [gameState, gameStep]);

  useEffect(() => {
    if (gameState === 'gameover') {
      const earned = Math.floor(scoreRef.current / 3);
      setCoinsEarned(earned);
      if (earned > 0 && onEarnCoins) onEarnCoins(earned);
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
        localStorage.setItem('snake_high', scoreRef.current);
      }
      if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
    }
  }, [gameState, highScore, onEarnCoins]);

  useEffect(() => {
    if (gameState === 'idle' && (isModalOpen || standalone)) {
      setTimeout(() => drawGame(), 80);
    }
  }, [gameState, drawGame, isModalOpen, standalone, canvasSize]);

  useEffect(() => {
    if (!isModalOpen && !standalone) return;
    const handleKey = (e) => {
      if (gameStateRef.current !== 'playing') return;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': changeDir({ x: 0, y: -1 }); e.preventDefault(); break;
        case 'ArrowDown': case 's': case 'S': changeDir({ x: 0, y: 1 }); e.preventDefault(); break;
        case 'ArrowLeft': case 'a': case 'A': changeDir({ x: -1, y: 0 }); e.preventDefault(); break;
        case 'ArrowRight': case 'd': case 'D': changeDir({ x: 1, y: 0 }); e.preventDefault(); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [changeDir, isModalOpen, standalone]);

  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const handleTouchMove = useCallback((e) => { e.preventDefault(); }, []);
  const handleTouchEnd = useCallback((e) => {
    if (!touchStartRef.current || gameStateRef.current !== 'playing') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
      if (Math.abs(dx) > Math.abs(dy)) changeDir(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
      else changeDir(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    }
    touchStartRef.current = null;
  }, [changeDir]);

  const handleDirBtn = useCallback((dir) => {
    if (gameStateRef.current !== 'playing') return;
    changeDir(dir);
  }, [changeDir]);

  const closeModal = () => {
    if (gameState === 'playing') setGameState('idle');
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      {!standalone && (
        <div className="snake-game-wrapper" onClick={() => setIsModalOpen(true)}>
          <div className="snake-game-header">
            <div className="snake-game-title">
              <span className="snake-game-icon">🐍</span>
              <span>{langConfig.snake} + {langConfig.mining}</span>
              <span className="snake-game-badge">{lang === 'uz' ? 'Ochish' : lang === 'ru' ? 'Открыть' : 'Open'}</span>
            </div>
            <div className="snake-game-stats">
              <span className="snake-stat">⭐ {highScore}</span>
              <span className="snake-stat snake-stat-high">🪙 {coins}</span>
            </div>
          </div>
        </div>
      )}

      {(isModalOpen || standalone) && (
        <div className={standalone ? "snake-standalone-body" : "snake-modal-backdrop"} 
             onClick={(e) => { if (e.target === e.currentTarget && gameState !== 'playing' && !standalone) closeModal(); }}>
          <div className={standalone ? "snake-standalone-container" : "snake-modal"}>
            {!standalone && (
              <div className="snake-modal-header">
                <h3 className="snake-modal-title">🐍 {langConfig.snake}</h3>
                <button className="snake-modal-close" onClick={closeModal}>✕</button>
              </div>
            )}

            <div className="snake-modal-coins">
              <div className="snake-coin-display">
                <span className="snake-coin-amount">{coins}</span>
                <span className="snake-coin-label">🪙 {lang === 'uz' ? 'Tanga' : lang === 'ru' ? 'Койнов' : 'Coins'}</span>
              </div>
              <div className="snake-coin-info">
                <span>🏆 {lang === 'uz' ? 'Rekord' : lang === 'ru' ? 'Рекорд' : 'Record'}: {highScore}</span>
                <span>📏 3 {lang === 'uz' ? 'olma' : lang === 'ru' ? 'яблока' : 'apples'} = 1 {lang === 'uz' ? 'tanga' : lang === 'ru' ? 'койн' : 'coin'}</span>
              </div>
            </div>

            <div className="snake-game-body" ref={containerRef}>
              <div className="snake-canvas-container" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} className="snake-canvas" />
                {gameState === 'idle' && (
                  <div className="snake-overlay">
                    <button className="snake-play-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>▶ {lang === 'uz' ? 'Boshlash' : lang === 'ru' ? 'Начать' : 'Start'}</button>
                    <p className="snake-hint">{lang === 'uz' ? 'Strelkalar · Swipe · Tugmalar' : lang === 'ru' ? 'Стрелки · Свайп · Кнопки' : 'Arrows · Swipe · Buttons'}</p>
                  </div>
                )}
                {gameState === 'gameover' && (
                  <div className="snake-overlay snake-overlay-gameover">
                    <div className="snake-gameover-title">{langConfig.win.replace('Tabriklaymiz', lang === 'uz' ? "O'yin Tugadi" : lang === 'ru' ? "Игра Окончена" : "Game Over")}</div>
                    <div className="snake-gameover-score">{lang === 'uz' ? 'Skor' : lang === 'ru' ? 'Счет' : 'Score'}: {score} · {lang === 'uz' ? 'Uzunlik' : lang === 'ru' ? 'Длина' : 'Length'}: {snakeLength}</div>
                    {coinsEarned > 0 && <div className="snake-coins-earned">+{coinsEarned} {lang === 'uz' ? 'tanga yutdingiz!' : lang === 'ru' ? 'койнов выиграно!' : 'coins earned!'} 🪙</div>}
                    <button className="snake-play-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>🔄 {langConfig.again}</button>
                  </div>
                )}
              </div>
              {gameState === 'playing' && <div className="snake-live-score"><span>⭐ {lang === 'uz' ? 'Skor' : lang === 'ru' ? 'Счет' : 'Score'}: {score}</span><span>🐍 {lang === 'uz' ? 'Uzunlik' : lang === 'ru' ? 'Длина' : 'Length'}: {snakeLength}</span></div>}
              <div className="snake-controls-mobile">
                <button className="snake-ctrl-btn" onPointerDown={() => handleDirBtn({ x: 0, y: -1 })}>▲</button>
                <div className="snake-ctrl-row">
                  <button className="snake-ctrl-btn" onPointerDown={() => handleDirBtn({ x: -1, y: 0 })}>◀</button>
                  <button className="snake-ctrl-btn snake-ctrl-center" onPointerDown={() => handleDirBtn({ x: 0, y: 1 })}>▼</button>
                  <button className="snake-ctrl-btn" onPointerDown={() => handleDirBtn({ x: 1, y: 0 })}>▶</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SnakeGame;
