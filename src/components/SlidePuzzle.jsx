import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import AppContext from '../context/AppContext';

const SlidePuzzle = ({ onEarnCoins }) => {
  const { langConfig, lang } = useContext(AppContext);
  const [level, setLevel] = useState(1);
  const [tiles, setTiles] = useState([]);
  const [solved, setSolved] = useState(false);

  const getGridSize = (lvl) => {
    if (lvl === 1) return 2; // 2x2
    if (lvl === 2) return 3; // 3x3
    if (lvl === 3) return 4; // 4x4
    return 5; // 5x5
  };

  const gridSize = getGridSize(level);

  const isSolvable = useCallback((arr) => {
    let inversions = 0;
    const len = arr.length;
    const flatArr = arr.filter(t => t !== null);
    
    for (let i = 0; i < flatArr.length; i++) {
      for (let j = i + 1; j < flatArr.length; j++) {
        if (flatArr[i] > flatArr[j]) inversions++;
      }
    }

    if (gridSize % 2 !== 0) {
      return inversions % 2 === 0;
    } else {
      const emptyRowFromBottom = gridSize - Math.floor(arr.indexOf(null) / gridSize);
      if (emptyRowFromBottom % 2 === 0) {
        return inversions % 2 !== 0;
      } else {
        return inversions % 2 === 0;
      }
    }
  }, [gridSize]);

  const shuffle = useCallback(() => {
    let arr = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
    let shuffled;
    do {
      shuffled = [...arr].sort(() => Math.random() - 0.5);
    } while (!isSolvable([...shuffled, null]));
    
    setTiles([...shuffled, null]);
    setSolved(false);
  }, [gridSize, isSolvable]);

  useEffect(() => {
    shuffle();
  }, [shuffle]);

  const moveTile = (index) => {
    if (solved) return;
    const emptyIndex = tiles.indexOf(null);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      newTiles[emptyIndex] = tiles[index];
      newTiles[index] = null;
      setTiles(newTiles);

      if (newTiles.every((t, i) => i === gridSize * gridSize - 1 ? t === null : t === i + 1)) {
        setSolved(true);
        onEarnCoins(20 * level); // 20, 40, 60, 80 coins
      }
    }
  };

  const nextLevel = () => {
    setLevel(prev => Math.min(4, prev + 1));
    setSolved(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
         <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Level {level} ({gridSize}x{gridSize})</span>
         <span style={{ opacity: 0.7 }}>{lang === 'uz' ? 'Tartiblang' : 'Arrange'}</span>
      </div>

      <div style={{ 
        position: 'relative', width: '100%', maxWidth: '320px', aspectRatio: '1', 
        background: 'rgba(0,0,0,0.1)', borderRadius: '20px', padding: '10px', 
        display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '8px' 
      }}>
        {tiles.map((tile, index) => (
          <motion.div
            key={index}
            layout
            onClick={() => moveTile(index)}
            style={{
              background: tile ? 'var(--primary)' : 'transparent',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: gridSize > 4 ? '1rem' : '1.4rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              cursor: tile ? 'pointer' : 'default',
              boxShadow: tile ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
              border: tile ? '1px solid rgba(255,255,255,0.2)' : 'none'
            }}
          >
            {tile}
          </motion.div>
        ))}
      </div>
      
      {solved && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '20px', width: '100%' }}>
          <h3 style={{ color: '#2ecc71', marginBottom: '10px' }}>{lang === 'uz' ? 'Ajoyib! G\'alaba!' : 'Great! Victory!'} 🎉</h3>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={shuffle} style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }}>{langConfig.again}</button>
            {level < 4 && (
              <button onClick={nextLevel} style={{ padding: '10px 20px', borderRadius: '50px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                {lang === 'uz' ? 'Keyingi Level' : 'Next Level'} →
              </button>
            )}
          </div>
        </motion.div>
      )}
      {!solved && (
        <button onClick={shuffle} style={{ padding: '8px 20px', fontSize: '0.85rem', opacity: 0.7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'inherit', borderRadius: '50px', cursor: 'pointer' }}>
          {lang === 'uz' ? 'Aralashtirish' : 'Shuffle'}
        </button>
      )}
    </div>
  );
};

export default SlidePuzzle;
