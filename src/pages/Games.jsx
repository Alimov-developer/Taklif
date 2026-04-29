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
      reward: lang === 'uz' ? 'G\'alaba = 50 tanga' : lang === 'ru' ? 'Победа = 50 койнов' : 'Victory = 50 coins',
      playable: true
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
      default:
        return null;
    }
  };

  return (
    <AnimatedPage className="page-container" style={{ paddingBottom: '100px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="card games-header" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, #b8860b 100%)', 
        color: 'white', 
        padding: '2rem',
        borderRadius: '24px',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{langConfig.gameTitle}</h2>
          <p style={{ opacity: 0.9 }}>{langConfig.gameDesc}</p>
        </div>
        <Gamepad2 size={100} style={{ 
          position: 'absolute', 
          right: '-10px', 
          bottom: '-10px', 
          opacity: 0.2, 
          transform: 'rotate(-15deg)' 
        }} />
      </div>

      <AnimatePresence mode="wait">
        {activeGame ? (
          <motion.div 
            key="active-game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="card active-game-container"
            style={{ 
              padding: '2rem 1rem', 
              borderRadius: '28px', 
              marginBottom: '2rem',
              background: 'var(--card-bg)',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: '2px solid var(--primary-light)',
              minHeight: '450px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button 
              onClick={() => setActiveGame(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.05)',
                border: 'none',
                color: 'var(--text)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
                fontSize: '1.2rem'
              }}
            >✕</button>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {renderGame()}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="game-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="games-list-vertical" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem' 
            }}
          >
            {gameList.map((game, idx) => (
              <motion.div 
                key={game.id}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => game.playable && setActiveGame(game.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '1rem',
                  border: `1px solid ${game.color}20`,
                  background: 'var(--card-bg)',
                  borderRadius: '20px',
                  cursor: game.playable ? 'pointer' : 'not-allowed',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  gap: '0.8rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ 
                  background: `${game.color}15`, 
                  color: game.color,
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  flexShrink: 0
                }}>
                  {game.icon}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem', fontWeight: 'bold' }}>{game.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{game.desc}</p>
                </div>
                <div style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 'bold', 
                  color: game.color, 
                  background: `${game.color}10`,
                  padding: '4px 10px',
                  borderRadius: '50px',
                  whiteSpace: 'nowrap',
                  marginLeft: 'auto'
                }}>
                  {game.reward}
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
