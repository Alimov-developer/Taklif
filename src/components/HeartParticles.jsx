import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const HeartParticles = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const p = Array.from({ length: 15 }).map((_, i) => ({
      id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 15}s`, size: `${Math.random() * 10 + 10}px`
    }));
    setParticles(p);
  }, []);
  return (
    <div className="bg-decor">
      {particles.map(p => (
        <Heart key={p.id} className="heart-particle"
          style={{ 
            left: p.left, 
            animationDelay: p.delay, 
            width: p.size, 
            height: p.size, 
            position: 'absolute', 
            color: 'rgba(212, 175, 55, 0.1)', 
            animation: 'floatHeart 15s linear infinite' 
          }}
          fill="currentColor" />
      ))}
    </div>
  );
};

export default HeartParticles;
