import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Download, Home, X, RotateCw } from 'lucide-react';
import { toPng } from 'html-to-image';
import HeartParticles from '../components/HeartParticles';
import Petals from '../components/Petals';
import GoldDust from '../components/GoldDust';
import AnimatedPage from '../components/AnimatedPage';
import AppContext from '../context/AppContext';

const InvitationView = () => {
  const { socket, lang, langConfig } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: rawData } = useParams();
  const data = rawData?.toLowerCase(); // Case-insensitive match
  const [params, setParams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('pending'); // pending, sent
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const isDlMode = searchParams.get('dl') === '1';

  useEffect(() => {
    if (!data) return;
    console.log("Fetching invitation for:", data);

    const fetchFromLocal = () => {
      // Try specific data key
      const stored = localStorage.getItem(`inv_data_${data}`);
      if (stored) {
        setParams(JSON.parse(stored));
        setIsLoading(false);
        return;
      }
      
      // Try searching in myInvitations list
      const myInvs = JSON.parse(localStorage.getItem('myInvitations')) || [];
      const found = myInvs.find(i => i.shortName === data || i.shortName?.toLowerCase() === data);
      if (found) {
        setParams(found);
      }
      setIsLoading(false);
    };

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Socket timeout, checking local...");
        fetchFromLocal();
      }
    }, 3000);

    if (socket) {
      const handleInvitationData = (backendData) => {
        console.log("Received invitation data from backend:", backendData);
        if (backendData) {
          setParams(backendData);
          setIsLoading(false);
        } else {
          fetchFromLocal();
        }
      };
      socket.on('invitation_data', handleInvitationData);
      socket.emit('get_invitation', data);
      
      return () => {
        socket.off('invitation_data', handleInvitationData);
        clearTimeout(timeout);
      };
    } else {
      fetchFromLocal();
      return () => clearTimeout(timeout);
    }
  }, [data, socket]);

  useEffect(() => {
    if (!isLoading && params && isDlMode) {
      // Berilgan vaqtda dom tayyor bo'lishi uchun ozgina kutamiz
      const timer = setTimeout(() => {
        downloadImage();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, params, isDlMode]);

  useEffect(() => {
    if (!params?.date) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = new Date(params.date).getTime() - now;
      if (diff > 0) {
        setTimeLeft({ days: Math.floor(diff / (1000 * 60 * 60 * 24)), hours: Math.floor((diff / (1000 * 60 * 60)) % 24), minutes: Math.floor((diff / 1000 / 60) % 60) });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [params]);

  const ref = useRef(null);

  const downloadImage = () => {
    if(!ref.current) return;
    toPng(ref.current, { cacheBust: true, backgroundColor: 'transparent' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${data}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(err => alert("Rasimga olishda xatolik yuz berdi: " + err));
  };

  const getThemeStyles = (themeMode) => {
    switch(themeMode) {
      case 'midnight': return { bg: 'linear-gradient(135deg, #021027 0%, #08203e 100%)', text: '#fff', accent: '#FFD700', cardBg: 'rgba(2, 16, 39, 0.6)' };
      case 'rose': return { bg: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)', text: '#5c2d2d', accent: '#d63384', cardBg: 'rgba(255, 255, 255, 0.8)' };
      case 'forest': return { bg: 'linear-gradient(135deg, #0a2e1a 0%, #1a4d2e 100%)', text: '#fff', accent: '#fbbf24', cardBg: 'rgba(10, 46, 26, 0.5)' };
      case 'pearl': return { bg: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', text: '#2d3436', accent: '#6c5ce7', cardBg: 'rgba(255, 255, 255, 0.9)' };
      case 'royal_gold': return { bg: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)', text: '#fff', accent: '#D4AF37', cardBg: 'rgba(26, 26, 26, 0.7)' };
      case 'lavender': return { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#fff', accent: '#f8f9fa', cardBg: 'rgba(102, 126, 234, 0.4)' };
      case 'champagne': return { bg: 'linear-gradient(135deg, #f7e7ce 0%, #e3d5b8 100%)', text: '#4a3f35', accent: '#8e735b', cardBg: 'rgba(247, 231, 206, 0.8)' };
      case 'ocean': return { bg: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', text: '#fff', accent: '#a1c4fd', cardBg: 'rgba(43, 88, 118, 0.5)' };
      case 'crimson': return { bg: 'linear-gradient(135deg, #4f000b 0%, #720026 100%)', text: '#fff', accent: '#ffb5a7', cardBg: 'rgba(40, 0, 10, 0.5)' };
      case 'classic': return { bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', text: '#2d3436', accent: '#3498db', cardBg: 'rgba(255, 255, 255, 0.8)' };
      default: return { bg: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', text: '#fff', accent: '#FFD700', cardBg: 'rgba(20, 30, 40, 0.4)' };
    }
  };

  if (isLoading) return (
    <div className="page-container" style={{ 
      background: '#000', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      width: '100%',
      position: 'relative'
    }}>
      <GoldDust />
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: '3.5rem', marginBottom: '2rem', filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.5))' }}
        >
          💍
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '1.4rem', fontWeight: '300', letterSpacing: '4px', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '2rem' }}
        >
          {lang === 'uz' ? 'Yuklanmoqda...' : lang === 'ru' ? 'Загрузка...' : 'Loading...'}
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => window.location.reload()}
          style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid #D4AF37', color: '#D4AF37', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <RotateCw size={18} /> {lang === 'uz' ? 'Qayta yuklash' : 'Reload'}
        </motion.button>
      </div>
    </div>
  );

  if (!params) return (
    <div className="page-container" style={{ 
      textAlign: 'center', 
      padding: '5rem 2rem', 
      background: '#000', 
      color: 'white',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
       <GoldDust />
       <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px' }}>
         <motion.div 
           initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
           style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(255, 68, 68, 0.2)' }}
         >
           <X size={48} color="#ff4444" />
         </motion.div>
         
         <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>
           {lang === 'uz' ? 'Taklifnoma topilmadi' : lang === 'ru' ? 'Приглашение не найдено' : 'Invitation not found'}
         </h2>
         
         <p style={{ opacity: 0.6, marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
           {lang === 'uz' ? 'Taklifnoma hali yaratilmagan yoki o\'chirilgan bo\'lishi mumkin. Iltimos, ma\'lumotlarni qaytadan tekshiring yoki qayta urinib ko\'ring.' : 'It might not be created yet or was deleted. Please check the information or try refreshing.'}
         </p>
         
         <motion.button 
           whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
           onClick={() => window.location.reload()} 
           className="btn-luxury" 
           style={{ width: '100%', padding: '15px', borderRadius: '15px', marginBottom: '1rem', background: 'linear-gradient(45deg, #D4AF37, #F1D382)', color: '#000', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 10px 20px rgba(212, 175, 55, 0.3)' }}
         >
           {lang === 'uz' ? 'Sahifani yangilash' : lang === 'ru' ? 'Обновить страницу' : 'Refresh Page'}
         </motion.button>
         
         <button 
           onClick={() => navigate('/dashboard')} 
           style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
         >
           {lang === 'uz' ? 'Asosiy sahifaga qaytish' : 'Return to Home'}
         </button>
       </div>
    </div>
  );

  const activeTheme = getThemeStyles(params.theme || 'midnight');

  return (
    <AnimatedPage className="page-container no-scrollbar" style={{ 
        maxWidth: '100%', minHeight: '100vh', minHeight: '100dvh', margin: '0 auto', textAlign: 'center', 
        background: activeTheme.bg, 
        color: activeTheme.text,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto', position: 'relative'
    }}>
       {/* Floating Navigation */}
       <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100, display: 'flex', gap: '10px' }}>
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')}
            style={{ 
              width: '45px', height: '45px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', 
              color: '#fff', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' 
            }}
          >
            <Home size={20} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => window.location.reload()}
            style={{ 
              width: '45px', height: '45px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', 
              color: '#fff', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' 
            }}
          >
            <RotateCw size={20} />
          </motion.button>
       </div>

       <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
           <GoldDust />
           <HeartParticles />
           <Petals color={activeTheme.accent} />
       </div>
       
       <motion.div 
           ref={ref}
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
           className="card no-scrollbar" style={{ 
               width: '100%', maxWidth: '450px', 
               background: activeTheme.cardBg, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
               border: `1px solid ${activeTheme.accent}40`, padding: '3rem 2rem', 
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', borderRadius: '40px',
               position: 'relative', zIndex: 1, color: activeTheme.text,
               display: 'flex', flexDirection: 'column', gap: '2rem',
               marginBottom: '2rem'
           }}
       >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: `radial-gradient(circle, ${activeTheme.accent}20 0%, transparent 70%)`, zIndex: -1 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} style={{ color: activeTheme.accent, fontSize: '2.5rem', filter: `drop-shadow(0 0 10px ${activeTheme.accent}60)` }}>💍</motion.div>
            
            {params.photo && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} 
                style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', border: `3px solid ${activeTheme.accent}30`, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
              >
                 <img src={params.photo} alt="Wedding" style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
              </motion.div>
            )}

            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', margin: '0', color: activeTheme.text, lineHeight: '1', textShadow: '2px 4px 10px rgba(0,0,0,0.4)' }}>{params.groom}</h1>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: activeTheme.accent, margin: '0.5rem 0', fontStyle: 'italic', opacity: 0.8 }}>&</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', margin: '0', color: activeTheme.text, lineHeight: '1', textShadow: '2px 4px 10px rgba(0,0,0,0.4)' }}>{params.bride}</h1>
            </div>
            
            <p style={{ color: activeTheme.text, opacity: 0.9, fontSize: '1rem', margin: '0.5rem 0', fontWeight: '300', letterSpacing: '1px' }}>
              {lang === 'uz' ? 'Sizni baxt oqshomimizda kutib qolamiz!' : lang === 'ru' ? 'Мы ждем вас на нашем счастливом вечере!' : 'We are waiting for you at our happy evening!'}
            </p>

            {params.aboutUs && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', borderTop: `1px solid ${activeTheme.accent}20`, fontStyle: 'italic', fontSize: '0.9rem', opacity: 0.8 }}>
                 "{params.aboutUs}"
              </div>
            )}
          </div>
          
          <div style={{ margin: '1rem 0' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: activeTheme.accent, opacity: 0.8, marginBottom: '0.8rem', fontWeight: 'bold' }}>
              {lang === 'uz' ? "To'ygacha qoldi" : lang === 'ru' ? 'До свадьбы осталось' : 'Countdown to wedding'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
               {[{v: timeLeft.days, l: lang === 'uz' ? 'KUN' : lang === 'ru' ? 'ДНЕЙ' : 'DAYS'}, {v: timeLeft.hours, l: lang === 'uz' ? 'SOAT' : lang === 'ru' ? 'ЧАСОВ' : 'HOURS'}, {v: timeLeft.minutes, l: lang === 'uz' ? 'MINUT' : lang === 'ru' ? 'МИНУТ' : 'MINUTES'}].map((t, idx) => (
                 <div key={t.l} style={{ flex: 1, padding: '0.8rem 0.4rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(5px)', minWidth: '60px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: activeTheme.accent }}>{t.v}</div>
                    <div style={{ fontSize: '0.55rem', color: activeTheme.text, opacity: 0.7, letterSpacing: '1px', marginTop: '4px' }}>{t.l}</div>
                 </div>
               ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.8rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${activeTheme.accent}20`, padding: '1rem', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left' }}>
                   <Calendar size={20} color={activeTheme.accent} />
                   <div>
                      <h4 style={{ fontSize: '0.9rem', margin: '0', color: activeTheme.text }}>
                        {params.date && !isNaN(new Date(params.date).getTime()) 
                          ? new Date(params.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' }) 
                          : '---'}
                      </h4>
                      <p style={{ color: activeTheme.text, opacity: 0.6, margin: 0, fontSize: '0.75rem' }}>
                        {params.date && !isNaN(new Date(params.date).getTime())
                          ? new Date(params.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '---'}
                      </p>
                   </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${activeTheme.accent}20`, padding: '1rem', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left' }}>
                  <MapPin size={20} color={activeTheme.accent} />
                  <div>
                     <h4 style={{ fontSize: '0.9rem', margin: '0', color: activeTheme.text }}>{params.venue}</h4>
                     <p style={{ color: activeTheme.text, opacity: 0.6, margin: 0, fontSize: '0.75rem' }}>{params.address}</p>
                  </div>
              </div>
          </div>
       </motion.div>

        {/* RSVP Card */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
           className="card" style={{ 
              width: '100%', maxWidth: '450px', 
              background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)',
              border: `1px solid ${activeTheme.accent}20`, padding: '2rem', 
              borderRadius: '30px', zIndex: 1, color: activeTheme.text,
              display: 'flex', flexDirection: 'column', gap: '1.2rem',
              marginBottom: '100px'
           }}
        >
           <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{lang === 'uz' ? "Tashrifingizni tasdiqlang" : "Confirm your attendance"}</h3>
           {rsvpStatus === 'sent' ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ padding: '1rem', background: 'rgba(46, 204, 113, 0.2)', borderRadius: '15px', color: '#2ecc71', fontWeight: 'bold' }}>
                 ✅ {lang === 'uz' ? "Rahmat! Ismingiz ro'yxatga olindi." : "Thank you! Your name is registered."}
              </motion.div>
           ) : (
              <>
                 <input 
                   value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                   placeholder={lang === 'uz' ? "Ismingiz va familiyangiz" : "Your full name"} 
                   style={{ padding: '12px 20px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', outline: 'none' }}
                 />
                 <motion.button 
                   whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                   onClick={() => rsvpName && setRsvpStatus('sent')}
                   style={{ padding: '12px', borderRadius: '15px', background: activeTheme.accent, color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                 >
                    {lang === 'uz' ? "Yuborish" : "Send RSVP"}
                 </motion.button>
              </>
           )}
        </motion.div>

       <motion.button 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onClick={downloadImage} 
          style={{ position: 'fixed', bottom: '30px', zIndex: 100, padding: '15px 30px', borderRadius: '50px', background: activeTheme.accent, color: activeTheme.text === '#fff' ? '#000' : '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: `0 15px 35px ${activeTheme.accent}80`, fontSize: '0.9rem' }}
       >
          <Download size={20} /> {lang === 'uz' ? 'Tasvirni Yuklash' : lang === 'ru' ? 'Скачать Изображение' : 'Download Image'}
       </motion.button>
    </AnimatedPage>
  );
};

export default InvitationView;
