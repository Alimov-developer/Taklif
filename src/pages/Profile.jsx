import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins as CoinIcon, Copy, ExternalLink, Image as ImageIcon, Send } from 'lucide-react';
import AppContext from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';

const Profile = () => {
  const { coins, user, langConfig, lang } = useContext(AppContext);
  const [invitations, setInvitations] = useState([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('myInvitations')) || [];
      setInvitations(data);
    } catch(e) {}
    
    const ticker = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(ticker);
  }, []);

  const handleDelete = (id, shortName) => {
    const confirmMsg = lang === 'uz' ? "Rostdan ham ushbu taklifnomani o'chirasizmi?" : lang === 'ru' ? "Вы уверены, что хотите удалить это приглашение?" : "Are you sure you want to delete this invitation?";
    if(window.confirm(confirmMsg)) {
      const updated = invitations.filter(inv => inv.id !== id);
      setInvitations(updated);
      localStorage.setItem('myInvitations', JSON.stringify(updated));
      localStorage.removeItem(`inv_data_${shortName}`); 
    }
  };

  const getCountdown = (dateString) => {
    const target = new Date(dateString).getTime();
    const diff = target - now;
    if (diff <= 0) return lang === 'uz' ? "Vaqti o'tdi" : lang === 'ru' ? "Время вышло" : "Expired";
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${d} ${langConfig.days.toLowerCase()} ${h} ${langConfig.hours.toLowerCase()}`;
  };

  return (
    <AnimatedPage className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card profile-header" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
          <motion.div 
            animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)', zIndex: 0 }}
          />
          <div style={{ zIndex: 1, width: '120px', height: '120px', minWidth: '120px', borderRadius: '50%', background: 'linear-gradient(45deg, #FFD700, #DAA520)', overflow: 'hidden', border: '5px solid var(--primary-light)', margin: '0 auto' }}>
            <img src={`https://unavatar.io/${user?.email || user?.username}?fallback=https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
          </div>
          <div style={{ zIndex: 1, minWidth: 0, width: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', wordBreak: 'break-word', marginBottom: '0.5rem' }}>{user?.username}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem', wordBreak: 'break-all' }}>{user?.email}</p>
          </div>
        </div>

       <div className="stats-grid" style={{ marginTop: '2rem' }}>
          <div className="card stat-card">
            <div className="stat-label">{langConfig.bal}</div>
            <div style={{ color: 'var(--text-dark)', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '0.5rem' }}>
              {coins} <CoinIcon size={16} />
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">{langConfig.projects}</div>
            <div style={{ color: 'var(--text-dark)', fontWeight: 'bold', marginTop: '0.5rem' }}>{invitations.length}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">{langConfig.orders}</div>
            <div style={{ color: 'var(--text-dark)', fontWeight: 'bold', marginTop: '0.5rem' }}>0</div>
          </div>
       </div>

       <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 'bold' }}>{langConfig.gallery}</div>
          </div>
          
          {invitations.length === 0 ? (
            <p style={{textAlign: 'center', color: 'var(--text-muted)', padding: '2rem'}}>{langConfig.empty}</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1rem' }}>
              <AnimatePresence>
                {invitations.map((inv, index) => (
                  <motion.div layout key={inv.id} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }} transition={{ type: 'spring', bounce: 0.3, delay: index * 0.05 }} className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(20,20,20,0.1) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '16px', marginBottom: 0, position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }}></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>
                             {inv.groom} & {inv.bride} 
                          </h4>
                          <div style={{ fontSize: '0.7rem', background: 'var(--primary-light)', padding: '3px 10px', borderRadius: '12px', color: 'var(--primary)', display: 'inline-block', marginTop: '5px', fontWeight: 'bold' }}>{getCountdown(inv.date)}</div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>{inv.url}</p>
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                         <span style={{ background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', fontSize: '0.65rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '50px' }}>{langConfig.active}</span>
                         <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDelete(inv.id, inv.shortName)} style={{ background: 'var(--bg-main)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '50px', cursor: 'pointer' }}>{langConfig.delete}</motion.button>
                       </div>
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '1.2rem' }}>
                        <motion.button whileHover={{ y: -2 }} className="auth-btn-outline" onClick={() => navigator.clipboard.writeText(inv.url)} style={{ padding: '0.6rem 0.2rem', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                          <Copy size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {langConfig.copy}
                        </motion.button>
                        <Link to={`/i/${inv.shortName}`} style={{ textDecoration: 'none' }}>
                          <motion.button whileHover={{ y: -2 }} className="auth-btn-outline" style={{ padding: '0.6rem 0.2rem', fontSize: '0.75rem', width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                             <ExternalLink size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {langConfig.view}
                          </motion.button>
                        </Link>
                        <Link to={`/i/${inv.shortName}?dl=1`} style={{ textDecoration: 'none' }}>
                          <motion.button whileHover={{ y: -2 }} className="auth-btn-outline" style={{ padding: '0.6rem 0.2rem', fontSize: '0.75rem', width: '100%', borderColor: '#10b981', color: '#10b981' }}>
                             <ImageIcon size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {langConfig.getImg}
                          </motion.button>
                        </Link>
                     </div>
                     <a href={`https://t.me/share/url?url=${encodeURIComponent(inv.url)}&text=${encodeURIComponent(lang === 'uz' ? "Bizning unutilmas baxt oqshomimizga tashrif buyuring!" : lang === 'ru' ? "Посетите наш незабываемый счастливый вечер!" : "Visit our unforgettable happy evening!")}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                       <motion.button whileHover={{ y: -2 }} className="btn-luxury" style={{ width: '100%', marginTop: '0.8rem', background: 'linear-gradient(45deg, #1e88e5, #0d47a1)', border: 'none', color: '#fff', fontSize: '0.9rem' }}>
                          <Send size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> {langConfig.shareTg}
                       </motion.button>
                     </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
       </div>
    </AnimatedPage>
  );
};

export default Profile;
