import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins as CoinIcon } from 'lucide-react';
import AppContext from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';

const Mining = () => {
  const { coins, setCoins, langConfig, lang } = useContext(AppContext);
  const [floatingTexts, setFloatingTexts] = useState([]);
  
  const [todayMined, setTodayMined] = useState(() => {
    try {
      const item = localStorage.getItem('minedData');
      if (item && item !== 'undefined') {
        const data = JSON.parse(item);
        if (data.date === new Date().toDateString()) return data.count;
      }
    } catch(e) {}
    return 0;
  });

  const handleCoinClick = (e) => {
    if (todayMined >= 10) return;
    setCoins(prev => prev + 1);
    setTodayMined(prev => {
      const newCount = prev + 1;
      localStorage.setItem('minedData', JSON.stringify({ date: new Date().toDateString(), count: newCount }));
      return newCount;
    });

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFloatingTexts(prev => [...prev, { id: Date.now(), x, y }]);
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  return (
    <AnimatedPage className="page-container" style={{ textAlign: 'center' }}>
       <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="stat-label">{langConfig.bal}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{coins}</span>
            <CoinIcon color="var(--primary)" fill="var(--primary)" size={32} />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1 {lang === 'uz' ? 'tanga' : lang === 'ru' ? 'койн' : 'coin'} = 1,000 {lang === 'uz' ? "so'm" : lang === 'ru' ? 'сум' : 'uzs'}</p>
       </div>

       <h2 style={{ marginTop: '2rem' }}>{langConfig.mineTitle}</h2>
       <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{langConfig.mineDesc}</p>
       <p style={{ color: todayMined >= 10 ? '#ef4444' : '#2ecc71', fontWeight: 'bold', marginBottom: '2rem' }}>
          {langConfig.mineLimit}: {todayMined} / 10
       </p>

       <motion.div 
         whileHover={todayMined < 10 ? { scale: 1.05 } : {}}
         whileTap={todayMined < 10 ? { scale: 0.9 } : {}}
         className="coin-big" onClick={handleCoinClick} 
         style={{ filter: todayMined >= 10 ? 'grayscale(0.8)' : 'none', cursor: todayMined >= 10 ? 'not-allowed' : 'pointer' }}
       >
          <CoinIcon size={120} color="white" fill="rgba(255,255,255,0.3)" />
          <AnimatePresence>
            {floatingTexts.map(ft => (
              <motion.div key={ft.id} initial={{ opacity: 1, y: ft.y - 120, x: ft.x - 125, scale: 0.5 }} animate={{ opacity: 0, y: ft.y - 250, scale: 1.5 }}
                onAnimationComplete={() => setFloatingTexts(prev => prev.filter(t => t.id !== ft.id))}
                style={{ position: 'absolute', pointerEvents: 'none', color: '#fff', fontWeight: 'bold', fontSize: '2rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
              >+1</motion.div>
            ))}
          </AnimatePresence>
       </motion.div>
    </AnimatedPage>
  );
};

export default Mining;
