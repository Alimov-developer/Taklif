import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import AppContext from '../context/AppContext';

const SIZE = 2; // 2x2 grid for "Easy" mode

const SlidePuzzle = ({ onEarnCoins }) => {
  const { langConfig, lang } = useContext(AppContext);
  const [tiles, setTiles] = useState([]);
  const [solved, setSolved] = useState(false);

  const isSolvable = (arr) => {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  };

  const shuffle = useCallback(() => {
    let arr = Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1);
    do {
      arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr));
    setTiles([...arr, null]);
    setSolved(false);
  }, []);

  useEffect(() => {
    shuffle();
  }, [shuffle]);

  const moveTile = (index) => {
    if (solved) return;
    const emptyIndex = tiles.indexOf(null);
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      newTiles[emptyIndex] = tiles[index];
      newTiles[index] = null;
      setTiles(newTiles);

      if (newTiles.every((t, i) => i === SIZE * SIZE - 1 ? t === null : t === i + 1)) {
        setSolved(true);
        onEarnCoins(50); // Big reward for solving puzzle
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '300px', aspectRatio: '1', background: 'rgba(0,0,0,0.1)', borderRadius: '15px', padding: '10px', display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: '8px' }}>
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
              fontSize: '1.5rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              cursor: tile ? 'pointer' : 'default',
              boxShadow: tile ? '0 4px 10px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            {tile}
          </motion.div>
        ))}
      </div>
      
      {solved && (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#2ecc71' }}>{lang === 'uz' ? 'Ajoyib! +50 Tanga! 🪙' : lang === 'ru' ? 'Отлично! +50 Койнов! 🪙' : 'Great! +50 Coins! 🪙'}</h3>
          <button onClick={shuffle} style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '50px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer' }}>{langConfig.again}</button>
        </div>
      )}
      {!solved && <button onClick={shuffle} style={{ padding: '8px 15px', fontSize: '0.8rem', opacity: 0.7, background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit', borderRadius: '8px' }}>{lang === 'uz' ? 'Aralashtirish' : lang === 'ru' ? 'Перемешать' : 'Shuffle'}</button>}
    </div>
  );
};

export default SlidePuzzle;
