import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import AppContext from '../context/AppContext';

const COLS = 10;
const ROWS = 20;

const TETROMINOS = {
  I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: '#00f0f0' },
  J: { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: '#f0a000' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: '#00f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: '#a000f0' },
  Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: '#f00000' }
};

const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS);
  return TETROMINOS[keys[Math.floor(Math.random() * keys.length)]];
};

const TetrisGame = ({ onEarnCoins }) => {
  const { lang, langConfig } = useContext(AppContext);
  const [grid, setGrid] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState(null);
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(800);
  const gameLoopRef = useRef();

  const resetGame = useCallback(() => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    const firstPiece = randomTetromino();
    setPiece(firstPiece);
    setPos({ x: 3, y: 0 });
    setGameOver(false);
    setScore(0);
    setSpeed(800);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const isValidMove = useCallback((newPos, newPiece = piece) => {
    if (!newPiece) return false;
    for (let y = 0; y < newPiece.shape.length; y++) {
      for (let x = 0; x < newPiece.shape[y].length; x++) {
        if (newPiece.shape[y][x]) {
          const newX = newPos.x + x;
          const newY = newPos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  }, [grid, piece]);

  const rotate = useCallback(() => {
    if (!piece) return;
    const rotated = piece.shape[0].map((_, index) => piece.shape.map(col => col[index]).reverse());
    const newPiece = { ...piece, shape: rotated };
    if (isValidMove(pos, newPiece)) {
      setPiece(newPiece);
    }
  }, [piece, pos, isValidMove]);

  const merge = useCallback(() => {
    const newGrid = grid.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const newY = pos.y + y;
          const newX = pos.x + x;
          if (newY >= 0) newGrid[newY][newX] = piece.color;
        }
      });
    });

    let linesCleared = 0;
    const filteredGrid = newGrid.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) linesCleared++;
      return !isFull;
    });

    while (filteredGrid.length < ROWS) {
      filteredGrid.unshift(Array(COLS).fill(0));
    }

    if (linesCleared > 0) {
      setScore(prev => prev + linesCleared * 100);
      onEarnCoins(linesCleared * 5); // 5 coins per line
      setSpeed(prev => Math.max(100, prev - 10));
    }

    setGrid(filteredGrid);
    const nextPiece = randomTetromino();
    if (!isValidMove({ x: 3, y: 0 }, nextPiece)) {
      setGameOver(true);
    } else {
      setPiece(nextPiece);
      setPos({ x: 3, y: 0 });
    }
  }, [grid, piece, pos, isValidMove, onEarnCoins]);

  const moveDown = useCallback(() => {
    if (isValidMove({ x: pos.x, y: pos.y + 1 })) {
      setPos(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      merge();
    }
  }, [pos, isValidMove, merge]);

  const moveSide = useCallback((dir) => {
    if (isValidMove({ x: pos.x + dir, y: pos.y })) {
      setPos(prev => ({ ...prev, x: prev.x + dir }));
    }
  }, [pos, isValidMove]);

  useEffect(() => {
    if (gameOver) return;
    gameLoopRef.current = setInterval(moveDown, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [moveDown, speed, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') moveSide(-1);
      if (e.key === 'ArrowRight') moveSide(1);
      if (e.key === 'ArrowDown') moveDown();
      if (e.key === 'ArrowUp') rotate();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveSide, moveDown, rotate, gameOver]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{lang === 'uz' ? 'Ball' : lang === 'ru' ? 'Счет' : 'Score'}: {score}</span>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>🪙 {Math.floor(score / 20)} {lang === 'uz' ? 'Tanga' : lang === 'ru' ? 'Койнов' : 'Coins'}</span>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        paddingTop: '200%', // 2:1 ratio (ROWS:COLS)
        background: '#1a1a1a', 
        border: '4px solid #333', 
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}>
          {grid.map((row, y) => row.map((cell, x) => (
            <div key={`${y}-${x}`} style={{ 
              background: cell || 'transparent', 
              border: cell ? '1px solid rgba(255,255,255,0.1)' : '0.1px solid rgba(255,255,255,0.02)' 
            }} />
          )))}
          
          {piece && piece.shape.map((row, y) => row.map((value, x) => {
            if (value) {
              return (
                <div key={`p-${y}-${x}`} style={{ 
                  position: 'absolute',
                  top: `${(pos.y + y) * (100 / ROWS)}%`,
                  left: `${(pos.x + x) * (100 / COLS)}%`,
                  width: `${100 / COLS}%`,
                  height: `${100 / ROWS}%`,
                  background: piece.color,
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: `inset 0 0 10px rgba(0,0,0,0.5)`,
                  borderRadius: '2px'
                }} />
              );
            }
            return null;
          }))}
        </div>

        {gameOver && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>{lang === 'uz' ? "O'yin Tugadi" : lang === 'ru' ? 'Игра Окончена' : 'Game Over'}</h2>
            <button onClick={resetGame} style={{ padding: '10px 20px', borderRadius: '50px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              {langConfig.again}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
        <div />
        <button onTouchStart={rotate} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--primary)', color: '#fff' }}>↻</button>
        <div />
        <button onTouchStart={() => moveSide(-1)} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--primary)', color: '#fff' }}>←</button>
        <button onTouchStart={moveDown} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--primary)', color: '#fff' }}>↓</button>
        <button onTouchStart={() => moveSide(1)} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--primary)', color: '#fff' }}>→</button>
      </div>
    </div>
  );
};

export default TetrisGame;
