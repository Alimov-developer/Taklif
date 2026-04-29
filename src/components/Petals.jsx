import React from 'react';
import { motion } from 'framer-motion';

const Petals = ({ color = '#ffb7c5' }) => {
  const petals = Array.from({ length: 15 });

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
      {petals.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: -20, 
            rotate: 0,
            opacity: 0 
          }}
          animate={{ 
            y: '110vh',
            x: [null, (Math.random() - 0.5) * 200 + 'px', null],
            rotate: 360,
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 20,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 15 + 10 + 'px',
            height: Math.random() * 10 + 5 + 'px',
            background: color,
            borderRadius: '50% 0 50% 50%',
            filter: 'blur(1px)',
            boxShadow: `0 0 10px ${color}50`
          }}
        />
      ))}
    </div>
  );
};

export default Petals;
