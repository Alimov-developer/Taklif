import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import AppContext from '../context/AppContext';

const THEMES = {
  wedding: ['💍', '🥂', '🍰', '💐', '💌', '❤️', '🕊️', '🎶'],
  fruits: ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉'],
  animals: ['🐶', '🐱', '🦁', '🐨', '🐘', '🐯', '🦒', '🦓'],
  space: ['🚀', '🪐', '🌟', '☄️', '🌌', '🛸', '🛰️', '🌑']
};

const MemoryGame = ({ onEarnCoins }) => {
  const { langConfig, lang } = useContext(AppContext);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [theme, setTheme] = useState('wedding');

  const initializeGame = useCallback(() => {
    const themeKeys = Object.keys(THEMES);
    const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    setTheme(randomTheme);
    
    const icons = THEMES[randomTheme];
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon }));
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  }, []);

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
        onEarnCoins(2); // 2 coins per match
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const isComplete = solved.length === cards.length && cards.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
        <span style={{ fontWeight: 'bold' }}>{langConfig.moves}: {moves}</span>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>🪙 {solved.length} {lang === 'uz' ? 'Tanga' : lang === 'ru' ? 'Койнов' : 'Coins'}</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '10px', 
        width: '100%', 
        maxWidth: '320px' 
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
                fontSize: '1.8rem',
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
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <h3 style={{ color: '#2ecc71', marginBottom: '10px' }}>{langConfig.win}</h3>
          <button onClick={initializeGame} style={{ padding: '10px 25px', borderRadius: '50px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            {langConfig.again}
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
