import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Star } from 'lucide-react';
import AnimatedPage from './AnimatedPage';

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(email) {
      if (password.length >= 6) {
        const username = email.split('@')[0];
        onLogin({ email, username });
      } else {
        setErrorMsg('Parol kamida 6 belgidan iborat bo\'lishi kerak!');
      }
    }
  };

  return (
    <AnimatedPage className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div 
            initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}
          >
             <Star fill="var(--primary)" size={32} />
             <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 'bold', marginLeft: '8px' }}>Taklif</span>
          </motion.div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Email manzilingizni kiriting</label>
            <input 
              type="email" 
              required 
              className="auth-input" 
              placeholder="name@gmail.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Parol</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" placeholder="12345678" />
              <Eye onClick={() => setShowPassword(!showPassword)} size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '10px', cursor: 'pointer' }} />
            </div>
          </div>
          
          {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>{errorMsg}</p>}
          
          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Xavfsizlik: Parolingiz tizimda saqlanmaydi (6+ belgi kiriting)</span>
          </div>
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="auth-btn-primary">Kirish</motion.button>
        </form>
        
        <div className="auth-divider">yoki</div>
        
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="auth-btn-outline" type="button">
           <span style={{ fontWeight: 'bold', color: '#4285F4', fontSize: '1.2rem', marginRight: '5px' }}>G</span> Google orqali kirish
        </motion.button>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Yangimisiz?</span> <span style={{ color: '#2ecc71', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>Hisob yaratish</span>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Auth;
