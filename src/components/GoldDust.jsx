import React from 'react';
import { motion } from 'framer-motion';

const GoldDust = () => {
  const particles = Array.from({ length: 50 });

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', 
      pointerEvents: 'none', background: '#050505' 
    }}>
      {/* Deep Mesh Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '5%', '-10%']
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ 
          position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', 
          background: 'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(108, 92, 231, 0.1) 0%, transparent 50%)',
          filter: 'blur(80px)' 
        }} 
      />

      {/* Shimmering Gold Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%', 
            scale: Math.random() * 0.4 + 0.1,
            opacity: Math.random() 
          }}
          animate={{ 
            y: [null, '-=150px', '+=50px'],
            opacity: [0, 1, 0],
            scale: [null, 1.5, null]
          }}
          transition={{ 
            duration: Math.random() * 7 + 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: Math.random() * 10
          }}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: '#D4AF37',
            borderRadius: '50%',
            boxShadow: '0 0 10px #D4AF37, 0 0 20px rgba(212, 175, 55, 0.5)'
          }}
        />
      ))}

      {/* Surface Shimmer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.03) 50%, transparent 55%)', backgroundSize: '200% 200%', animation: 'shimmer 10s infinite linear' }} />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>
    </div>
  );
};

export default GoldDust;
