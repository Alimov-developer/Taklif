import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import AppContext from '../context/AppContext';

const LANES = 3;
const GAME_SPEED = 5;

const RunnerGame = ({ onEarnCoins }) => {
  const { lang, langConfig } = useContext(AppContext);
  const [lane, setLane] = useState(1); // 0, 1, 2
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const gameLoopRef = useRef();
  const obstacleTimerRef = useRef();

  const startGame = () => {
    setGameOver(false);
    setScore(0);
    setLane(1);
    setObstacles([]);
    setGameActive(true);
  };

  const spawnObstacle = useCallback(() => {
    if (!gameActive) return;
    const newObstacle = {
      id: Date.now(),
      lane: Math.floor(Math.random() * LANES),
      y: -100,
    };
    setObstacles(prev => [...prev, newObstacle]);
  }, [gameActive]);

  useEffect(() => {
    if (gameActive && !gameOver) {
      obstacleTimerRef.current = setInterval(spawnObstacle, 1500);
      return () => clearInterval(obstacleTimerRef.current);
    }
  }, [gameActive, gameOver, spawnObstacle]);

  useEffect(() => {
    if (gameActive && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        setObstacles(prev => {
          const moved = prev.map(o => ({ ...o, y: o.y + GAME_SPEED }));
          
          // Collision check
          const hit = moved.find(o => o.y > 350 && o.y < 420 && o.lane === lane);
          if (hit) {
            setGameOver(true);
            setGameActive(false);
            return moved;
          }

          // Filter out obstacles that passed
          const filtered = moved.filter(o => o.y < 500);
          if (filtered.length < moved.length) {
            setScore(s => {
              const newScore = s + 10;
              if (newScore % 50 === 0) onEarnCoins(1); // 1 coin per 50 points
              return newScore;
            });
          }
          return filtered;
        });
      }, 20);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameActive, gameOver, lane, onEarnCoins]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setLane(l => Math.max(0, l - 1));
      if (e.key === 'ArrowRight') setLane(l => Math.min(LANES - 1, l + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{lang === 'uz' ? 'Masofa' : lang === 'ru' ? 'Дистанция' : 'Distance'}: {score}m</span>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>🪙 {Math.floor(score / 50)} {lang === 'uz' ? 'Tanga' : lang === 'ru' ? 'Койнов' : 'Coins'}</span>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        paddingTop: '150%', // 3:2 ratio
        background: 'linear-gradient(to bottom, #2c3e50, #000)', 
        border: '4px solid #444', 
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* Lanes */}
          <div style={{ position: 'absolute', left: '33.3%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', left: '66.6%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Obstacles */}
          {obstacles.map(o => (
            <div key={o.id} style={{ 
              position: 'absolute', 
              top: `${o.y}px`, 
              left: `${o.lane * 33.3 + 5}%`, 
              width: '23.3%', 
              height: '40px', 
              background: 'linear-gradient(45deg, #e74c3c, #c0392b)', 
              borderRadius: '8px',
              boxShadow: '0 5px 15px rgba(231, 76, 60, 0.4)',
              border: '2px solid #fff'
            }} />
          ))}

          {/* Player */}
          <div style={{ 
            position: 'absolute', 
            top: '80%', 
            left: `${lane * 33.3 + 8}%`, 
            width: '17%', 
            height: '12%', 
            background: 'linear-gradient(to bottom, var(--primary), #d4af37)', 
            borderRadius: '10px',
            transition: 'left 0.1s ease-out',
            boxShadow: '0 0 20px var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem'
          }}>
            🏃‍♂️
          </div>
        </div>

        {!gameActive && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>{gameOver ? (lang === 'uz' ? "O'yin Tugadi!" : lang === 'ru' ? "Игра Окончена!" : "Game Over!") : langConfig.runner}</h2>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>{lang === 'uz' ? "To'siqlardan qoching va tangalar yig'ing!" : lang === 'ru' ? "Избегайте препятствий и собирайте койны!" : "Avoid obstacles and collect coins!"}</p>
            <button onClick={startGame} style={{ padding: '12px 30px', borderRadius: '50px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
              {lang === 'uz' ? 'Boshlash' : lang === 'ru' ? 'Начать' : 'Start'}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        <button onTouchStart={() => setLane(l => Math.max(0, l - 1))} style={{ width: '80px', height: '60px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid var(--primary)', color: '#fff', fontSize: '1.5rem' }}>←</button>
        <button onTouchStart={() => setLane(l => Math.min(LANES - 1, l + 1))} style={{ width: '80px', height: '60px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid var(--primary)', color: '#fff', fontSize: '1.5rem' }}>→</button>
      </div>
    </div>
  );
};

export default RunnerGame;
