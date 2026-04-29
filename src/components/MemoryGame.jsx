import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import AppContext from '../context/AppContext';

const THEMES = {
  wedding: ['💍', '🥂', '🍰', '💐', '💌', '❤️', '🕊️', '🎶', '👰', '🤵', '🎂', '🎉'],
  fruits: ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉', '🍋', '🍑', '🍐', '🥭'],
  animals: ['🐶', '🐱', '🦁', '🐨', '🐘', '🐯', '🦒', '🦓', '🐼', '🦊', '🐸', '🐵'],
  space: ['🚀', '🪐', '🌟', '☄️', '🌌', '🛸', '🛰️', '🌑', '👽', '🔭', '🌍', '🌞']
};

const MemoryGame = ({ onEarnCoins }) => {
  const { langConfig, lang } = useContext(AppContext);
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [theme, setTheme] = useState('wedding');

  const getPairCount = (lvl) => {
    if (lvl === 1) return 2; // 2x2
    if (lvl === 2) return 4; // 2x4
    if (lvl === 3) return 6; // 3x4
    if (lvl === 4) return 8; // 4x4
    return Math.min(12, 8 + (lvl - 4) * 2);
  };

  const initializeGame = useCallback(() => {
    const themeKeys = Object.keys(THEMES);
    const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    setTheme(randomTheme);
    
    const pairCount = getPairCount(level);
    const icons = THEMES[randomTheme].slice(0, pairCount);
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon }));
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setDisabled(false);
  }, [level]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
    } else if (flipped.length === 1) {
      setDisabled(true);
      setFlipped([flipped[0], id]);
      setMoves(m => m + 1);

      const firstCard = cards.find(c => c.id === flipped[0]);
      const secondCard = cards.find(c => c.id === id);

      if (firstCard.icon === secondCard.icon) {
        setSolved(prev => [...prev, flipped[0], id]);
        setFlipped([]);
        setDisabled(false);
        onEarnCoins(2 * level); // More coins for higher levels
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 800 - (level * 50)); // Faster flips for higher levels
      }
    }
  };

  const isComplete = solved.length === cards.length && cards.length > 0;

  const nextLevel = () => {
    setLevel(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Level {level}</span>
            <span style={{ fontWeight: 'bold' }}>{langConfig.moves}: {moves}</span>
        </div>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>🪙 {solved.length}</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${cards.length <= 4 ? 2 : 4}, 1fr)`, 
        gap: '10px', 
        width: '100%', 
        maxWidth: '350px' 
      }}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || solved.includes(card.id);
          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(card.id)}
              style={{
                aspectRatio: '1',
                background: isFlipped ? 'var(--primary-light)' : 'var(--bg-card)',
                border: `2px solid ${isFlipped ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: cards.length > 16 ? '1.2rem' : '1.8rem',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {isFlipped ? card.icon : '?'}
            </motion.div>
          );
        })}
      </div>

      {isComplete && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', marginTop: '10px', padding: '1.5rem', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '20px', border: '1px solid #2ecc71' }}>
          <h3 style={{ color: '#2ecc71', marginBottom: '10px' }}>{langConfig.win}! 🎉</h3>
          <p style={{ marginBottom: '15px', opacity: 0.8 }}>Level {level} completed in {moves} moves.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={initializeGame} style={{ padding: '10px 20px', borderRadius: '15px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>
                {langConfig.again}
              </button>
              <button onClick={nextLevel} style={{ padding: '10px 25px', borderRadius: '15px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px var(--primary-light)' }}>
                {lang === 'uz' ? 'Keyingi Level' : 'Next Level'} →
              </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MemoryGame;
