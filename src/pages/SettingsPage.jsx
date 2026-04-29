import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import AppContext from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';

const SettingsPage = () => {
  const { lang, setLang, isDark, setIsDark, setUser, langConfig } = useContext(AppContext);
  return (
    <AnimatedPage className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>{langConfig.settings}</h2>
      
      <div className="card">
        <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{langConfig.system}</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
           <span>{langConfig.language}</span>
           <select className="auth-input" style={{ width: 'auto', padding: '0.5rem' }} value={lang} onChange={e => setLang(e.target.value)}>
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
           </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
           <span>{langConfig.darkMode}</span>
           <input type="checkbox" checked={isDark} onChange={e => setIsDark(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
           <span>{langConfig.sound}</span>
           <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(88,101,242,0.15) 0%, rgba(30,136,229,0.1) 100%)', border: '1px solid rgba(88,101,242,0.3)', borderRadius: '16px' }}>
        <h4 style={{ marginBottom: '1rem', color: '#1e88e5', display: 'flex', alignItems: 'center', gap: '8px' }}>
           🛡️ {langConfig.help}
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
          {langConfig.supportText}
        </p>
        <a href="https://t.me/al1mbayev10" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
           <motion.button whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(30,136,229,0.4)' }} whileTap={{ scale: 0.98 }} style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(90deg, #1e88e5 0%, #1565c0 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease' }}>
              <Send size={18} /> {langConfig.contact} @al1mbayev10
           </motion.button>
        </a>
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="auth-btn-primary" style={{ background: '#ef4444' }} onClick={() => { sessionStorage.removeItem('user'); setUser(null); }}>
         {langConfig.logout}
      </motion.button>
    </AnimatedPage>
  );
};

export default SettingsPage;
