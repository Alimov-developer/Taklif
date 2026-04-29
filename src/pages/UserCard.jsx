import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedPage from '../components/AnimatedPage';

const UserCard = () => {
  const { username } = useParams();
  
  useEffect(() => {
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 }, colors: ['#d4af37', '#ffffff', '#222222'] });
  }, []);

  return (
    <AnimatedPage className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <motion.div 
        animate={{ rotateX: [0, 5, 0, -5, 0], rotateY: [0, 10, 0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        style={{ perspective: 1000 }}
      >
        <div className="card auth-card" style={{ 
          background: 'radial-gradient(circle at top right, #333 0%, #111 100%)', 
          color: 'var(--primary)', border: '2px solid var(--primary)', 
          textAlign: 'center', padding: '4rem 2rem', boxShadow: '0 20px 50px rgba(212,175,55,0.3)', position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
          <Star size={40} fill="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h4 style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', color: '#fff', marginBottom: '1rem' }}>Siz Tomonidan Taklif</h4>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', margin: '1rem 0' }}>@{username}</h1>
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Eksklyuziv Foydalanuvchi</p>
          
          <div style={{ marginTop: '2rem', fontSize: '0.8rem', letterSpacing: '2px', color: '#888' }}>TAKLIF.UZ</div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
};

export default UserCard;
