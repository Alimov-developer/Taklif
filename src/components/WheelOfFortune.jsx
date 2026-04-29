import React, { useState, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import AppContext from '../context/AppContext';

const WheelOfFortune = ({ onEarnCoins }) => {
  const { lang } = useContext(AppContext);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  
  const segments = [
    { value: 10, color: '#FFD700', label: '10' },
    { value: 50, color: '#C0C0C0', label: '50' },
    { value: 5, color: '#CD7F32', label: '5' },
    { value: 100, color: '#FF4500', label: '100' },
    { value: 20, color: '#4169E1', label: '20' },
    { value: 0, color: '#333', label: '0' },
    { value: 15, color: '#32CD32', label: '15' },
    { value: 200, color: '#8A2BE2', label: '200' },
  ];

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    const extraRotations = 5 + Math.random() * 5;
    const finalRotation = rotation + extraRotations * 360;
    setRotation(finalRotation);
    
    setTimeout(() => {
      const normalizedRotation = finalRotation % 360;
      const segmentAngle = 360 / segments.length;
      // Calculate which segment is at the top (pointer is at 0 degrees)
      const winningIndex = Math.floor((360 - (normalizedRotation % 360)) / segmentAngle) % segments.length;
      const win = segments[winningIndex];
      
      setResult(win.value);
      setIsSpinning(false);
      if (win.value > 0) onEarnCoins(win.value);
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', padding: '20px', width: '100%' }}>
      <div style={{ position: 'relative', width: '280px', height: '280px' }}>
        {/* Pointer */}
        <div style={{ 
          position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', 
          width: '0', height: '0', borderLeft: '15px solid transparent', 
          borderRight: '15px solid transparent', borderTop: '30px solid #ff4444', 
          zIndex: 10, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))' 
        }} />
        
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }}
          style={{ 
            width: '100%', height: '100%', borderRadius: '50%', border: '8px solid #fff', 
            boxShadow: '0 0 30px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden',
            background: '#eee'
          }}
        >
          {segments.map((s, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', top: '0', left: '50%', width: '50%', height: '50%',
                background: s.color, transformOrigin: '0% 100%',
                transform: `rotate(${i * (360 / segments.length)}deg) skewY(${90 - (360 / segments.length)}deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
               <span style={{ 
                 position: 'absolute', bottom: '20px', left: '10px',
                 transform: `skewY(-${90 - (360 / segments.length)}deg) rotate(-45deg)`,
                 fontWeight: 'bold', color: 'white', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)'
               }}>
                 {s.label}
               </span>
            </div>
          ))}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', background: 'white', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,0,0,0.3)', zIndex: 5 }} />
        </motion.div>
      </div>

      <div style={{ textAlign: 'center' }}>
        {result !== null && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginBottom: '20px' }}>
             <h2 style={{ color: result > 0 ? '#f1c40f' : '#e74c3c', fontSize: '2rem' }}>
                {result > 0 ? `+${result} 🪙` : '😞'}
             </h2>
             <p style={{ opacity: 0.8 }}>{result > 0 ? (lang === 'uz' ? 'Tabriklaymiz!' : 'Congratulations!') : (lang === 'uz' ? 'Omad kelmadi' : 'No luck')}</p>
          </motion.div>
        )}
        
        <button 
          onClick={spin} disabled={isSpinning}
          style={{ 
            padding: '15px 40px', borderRadius: '50px', border: 'none', 
            background: isSpinning ? '#ccc' : 'linear-gradient(45deg, #FFD700, #FFA500)', 
            color: '#000', fontWeight: 'bold', fontSize: '1.1rem', cursor: isSpinning ? 'default' : 'pointer',
            boxShadow: '0 10px 20px rgba(255, 165, 0, 0.3)'
          }}
        >
          {isSpinning ? (lang === 'uz' ? 'Aylanmoqda...' : 'Spinning...') : (lang === 'uz' ? 'AYLANTIRISH' : 'SPIN')}
        </button>
      </div>
    </div>
  );
};

export default WheelOfFortune;
