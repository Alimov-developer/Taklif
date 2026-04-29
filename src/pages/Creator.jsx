import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedPage from '../components/AnimatedPage';
import AppContext from '../context/AppContext';

const Creator = () => {
  const { socket, lang, langConfig } = useContext(AppContext);
  const [formData, setFormData] = useState({ 
    groom: '', bride: '', date: '', venue: '', address: '', music: 'classic', 
    shortName: '', theme: 'midnight', photo: '' 
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInitialSubmit = () => {
    if(!formData.shortName || !formData.groom || !formData.bride) { 
        alert("Iltimos, barcha asosiy maydonlarni (Kuyov, Kelin va qisqa nom) to'ldiring!"); 
        return; 
    }
    
    setIsLoading(true);
    const newInv = { id: Date.now(), ...formData, url: `${window.location.origin}/i/${formData.shortName}` };
    
    // Save to Backend
    if (socket) {
      socket.emit('create_invitation', newInv);
    }

    const existing = JSON.parse(localStorage.getItem('myInvitations')) || [];
    localStorage.setItem('myInvitations', JSON.stringify([newInv, ...existing]));
    localStorage.setItem(`inv_data_${formData.shortName}`, JSON.stringify(formData));
    
    setTimeout(() => {
      setGeneratedLink(newInv.url);
      setIsLoading(false);
      confetti({ particleCount: 150, spread: 100 });
    }, 1000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Havola nusxalandi!');
  };

  return (
    <AnimatedPage className="page-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>Taklifnoma yaratish</h2>
      
      {!generatedLink ? (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="rsvp-form">
              <>
                <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center' }}>
                   ✨ Taklifnoma yaratish xizmati <b>mutlaqo bepul!</b>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="stat-label">{lang === 'uz' ? 'Kuyov' : lang === 'ru' ? 'Жених' : 'Groom'}</label>
                      <input className="auth-input" placeholder="..." onChange={e => setFormData({...formData, groom: e.target.value})} />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="stat-label">{lang === 'uz' ? 'Kelin' : lang === 'ru' ? 'Невеста' : 'Bride'}</label>
                      <input className="auth-input" placeholder="..." onChange={e => setFormData({...formData, bride: e.target.value})} />
                   </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                   <label className="stat-label">{lang === 'uz' ? 'Taklifnoma manzili nomi' : lang === 'ru' ? 'Название ссылки' : 'Invitation URL Name'}</label>
                   <input className="auth-input" placeholder="alisher-madina" onChange={e => setFormData({...formData, shortName: e.target.value.replace(/\s+/g,'').toLowerCase()})} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                   <label className="stat-label">{lang === 'uz' ? 'To\'y sanasi' : lang === 'ru' ? 'Дата свадьбы' : 'Wedding Date'}</label>
                   <input type="datetime-local" className="auth-input" onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                   <label className="stat-label">{lang === 'uz' ? 'To\'yxona' : lang === 'ru' ? 'Место проведения' : 'Venue'}</label>
                   <input className="auth-input" placeholder="..." onChange={e => setFormData({...formData, venue: e.target.value})} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                    <label className="stat-label">{lang === 'uz' ? 'Dizayn' : lang === 'ru' ? 'Дизайн' : 'Design'}</label>
                    <select className="auth-input" value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})}>
                       <option value="midnight">Tun Nafasi (Midnight Royal)</option>
                       <option value="rose">Atirgullar (Rose Quartz)</option>
                       <option value="forest">Zumrad O'rmon (Deep Forest)</option>
                       <option value="pearl">Marvarid (Ocean Pearl)</option>
                       <option value="royal_gold">Qirollik Oltini (Royal Gold)</option>
                       <option value="lavender">Lavanda (Lavender Mist)</option>
                       <option value="champagne">Shampan (Champagne Silk)</option>
                       <option value="ocean">Okean (Deep Ocean)</option>
                       <option value="crimson">Klassik Sevgi (Crimson Red)</option>
                       <option value="classic">Klassik (Soft Blue)</option>
                    </select>
                 </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                   <label className="stat-label">{lang === 'uz' ? 'Surat (Media)' : lang === 'ru' ? 'Фото (Медиа)' : 'Photo (Media)'}</label>
                   <input type="file" accept="image/*" className="auth-input" onChange={handlePhotoChange} style={{ padding: '8px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                   <label className="stat-label">{lang === 'uz' ? 'Manzil' : lang === 'ru' ? 'Адрес' : 'Address'}</label>
                   <input className="auth-input" placeholder="..." onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury" style={{ marginTop: '2rem', width: '100%' }} onClick={handleInitialSubmit}>
                  {lang === 'uz' ? 'Yaratish ✨' : lang === 'ru' ? 'Создать ✨' : 'Create ✨'}
                </motion.button>
              </>
            </div>
          </div>
        ) : (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
           <Heart size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
           <h3>Tabriklaymiz!</h3>
           <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Taklifnomangiz bazaga saqlandi. Havolani nusxalab Telegram orqali yuboring.</p>
           
           <div style={{ background: 'var(--bg-main)', border: '1px dashed var(--border-color)', padding: '1rem', borderRadius: '12px', wordBreak: 'break-all', fontSize: '0.8rem', margin: '1rem 0' }}>
             {generatedLink}
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button className="auth-btn-outline" onClick={copyLink}>Nusxalash</button>
              <button className="btn-luxury" onClick={() => navigate('/profile')}>Profilga o'tish</button>
           </div>
        </motion.div>
      )}
    </AnimatedPage>
  );
};

export default Creator;
