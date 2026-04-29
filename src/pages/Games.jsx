import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Coins, Star, ChevronRight } from 'lucide-react';
import AppContext from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';
import SnakeGame from '../components/SnakeGame';
import TetrisGame from '../components/TetrisGame';
import RunnerGame from '../components/RunnerGame';
import MemoryGame from '../components/MemoryGame';
import SlidePuzzle from '../components/SlidePuzzle';
import WheelOfFortune from '../components/WheelOfFortune';

const Games = () => {
  const { langConfig, lang, coins, handleSnakeEarnCoins } = useContext(AppContext);
  const [activeGame, setActiveGame] = useState(null);

  const gameList = [
    {
      id: 'snake',
      name: langConfig.snake,
      desc: lang === 'uz' ? 'Tangalar yig\'ing va rekord o\'rnating!' : lang === 'ru' ? 'Собирайте койны и ставьте рекорды!' : 'Collect coins and set records!',
      icon: '🐍',
      color: '#d4af37',
      reward: lang === 'uz' ? '3 olma = 1 tanga' : lang === 'ru' ? '3 яблока = 1 койн' : '3 apples = 1 coin',
      playable: true
    },
    {
      id: 'tetris',
      name: langConfig.tetris,
      desc: lang === 'uz' ? 'Bloklarni joylang va qatorlarni yo\'qoting.' : lang === 'ru' ? 'Расставляйте блоки и удаляйте линии.' : 'Place blocks and clear lines.',
      icon: '🧩',
      color: '#3b82f6',
      reward: lang === 'uz' ? '1 qator = 5 tanga' : lang === 'ru' ? '1 линия = 5 койнов' : '1 line = 5 coins',
      playable: true
    },
    {
      id: 'runner',
      name: langConfig.runner,
      desc: lang === 'uz' ? 'To\'siqlardan qoching va yuguring.' : lang === 'ru' ? 'Избегайте препятствий и бегите.' : 'Avoid obstacles and run.',
      icon: '🏃',
      color: '#ef4444',
      reward: lang === 'uz' ? '50m = 1 tanga' : lang === 'ru' ? '50м = 1 койн' : '50m = 1 coin',
      playable: true
    },
    {
      id: 'memory',
      name: langConfig.memory,
      desc: lang === 'uz' ? 'Juftliklarni toping va xotirani sinang.' : lang === 'ru' ? 'Найдите пары и проверьте память.' : 'Find pairs and test your memory.',
      icon: '🧠',
      color: '#9c27b0',
      reward: lang === 'uz' ? '1 juftlik = 2 tanga' : lang === 'ru' ? '1 пара = 2 койна' : '1 pair = 2 coins',
      playable: true
    },
    {
      id: 'puzzle',
      name: langConfig.puzzle,
      desc: lang === 'uz' ? 'Raqamlarni tartib bilan joylang.' : lang === 'ru' ? 'Расставьте цифры по порядку.' : 'Arrange numbers in order.',
      icon: '🎨',
      color: '#4caf50',
      reward: lang === 'uz' ? 'G\'alaba = 20-80 tanga' : lang === 'ru' ? 'Победа = 20-80 койнов' : 'Victory = 20-80 coins',
      playable: true
    },
    {
      id: 'wheel',
      name: lang === 'uz' ? 'Omad G\'ildiragi' : 'Wheel of Fortune',
      desc: lang === 'uz' ? 'Har kuni omadingizni sinab ko\'ring!' : 'Test your luck every day!',
      icon: '🎡',
      color: '#ff9800',
      reward: lang === 'uz' ? 'Yutuq = 200 tangagacha' : 'Win = up to 200 coins',
      playable: true,
      isNew: true
    }
  ];

  const renderGame = () => {
    switch (activeGame) {
      case 'snake':
        return <SnakeGame onEarnCoins={handleSnakeEarnCoins} coins={coins} standalone={true} />;
      case 'tetris':
        return <TetrisGame onEarnCoins={handleSnakeEarnCoins} />;
      case 'runner':
        return <RunnerGame onEarnCoins={handleSnakeEarnCoins} />;
      case 'memory':
        return <MemoryGame onEarnCoins={handleSnakeEarnCoins} />;
      case 'puzzle':
        return <SlidePuzzle onEarnCoins={handleSnakeEarnCoins} />;
      case 'wheel':
        return <WheelOfFortune onEarnCoins={handleSnakeEarnCoins} />;
      default:
        return null;
    }
  };

  return (
    <AnimatedPage className="page-container" style={{ paddingBottom: '100px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="card games-header" style={{ 
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', 
        color: 'white', 
        padding: '3rem 2rem',
        borderRadius: '32px',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.8rem', fontFamily: 'var(--font-serif)' }}>{langConfig.gameTitle}</h2>
          <p style={{ opacity: 0.8, fontSize: '1.1rem', maxWidth: '400px' }}>{langConfig.gameDesc}</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '15px' }}>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '50px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Trophy size={14} color="#f1c40f" /> Best Score: 1240
             </div>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '50px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Star size={14} color="#f1c40f" /> New Games Available
             </div>
          </div>
        </div>
        <Gamepad2 size={150} style={{ 
          position: 'absolute', 
          right: '-20px', 
          bottom: '-20px', 
          opacity: 0.15, 
          transform: 'rotate(-15deg)',
          color: 'var(--primary)'
        }} />
      </div>

      <AnimatePresence mode="wait">
        {activeGame ? (
          <motion.div 
            key="active-game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card active-game-container"
            style={{ 
              padding: '2.5rem 1.5rem', 
              borderRadius: '35px', 
              marginBottom: '2.5rem',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(30px)',
              position: 'relative',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
              onClick={() => setActiveGame(null)}
              style={{
                position: 'absolute',
                top: '25px',
                right: '25px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}
            >✕</motion.button>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {renderGame()}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="game-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1.5rem' 
            }}
          >
            {gameList.map((game, idx) => (
              <motion.div 
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, borderColor: game.color }}
                whileTap={{ scale: 0.98 }}
                onClick={() => game.playable && setActiveGame(game.id)}
                className="card"
                style={{ 
                  padding: '1.5rem',
                  cursor: game.playable ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div style={{ 
                      background: `${game.color}20`, 
                      color: game.color,
                      width: '60px',
                      height: '60px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      boxShadow: `0 10px 20px ${game.color}15`
                    }}>
                      {game.icon}
                   </div>
                   {game.isNew && (
                     <div style={{ background: '#ff4444', color: 'white', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(255,68,68,0.4)' }}>NEW</div>
                   )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>{game.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{game.desc}</p>
                </div>

                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  padding: '10px 15px',
                  background: 'var(--glass)',
                  borderRadius: '15px'
                }}>
                   <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: game.color }}>
                      {game.reward}
                   </div>
                   <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default Games;
