import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Coins as CoinIcon, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import AppContext from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';

const Dashboard = () => {
  const { user, coins, lang, langConfig, activeUsers, handleSnakeEarnCoins } = useContext(AppContext);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => setDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setDate(new Date(currentYear, currentMonth + 1, 1));

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wedding_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Kelin/Kuyov obrazini tanlash', completed: false },
      { id: 2, text: 'To\'yxona bilan kelishish', completed: true },
      { id: 3, text: 'Mehmonlar ro\'yxatini tuzish', completed: false },
    ];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('wedding_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const myInvitations = useMemo(() => JSON.parse(localStorage.getItem('myInvitations')) || [], []);
  const closestWedding = useMemo(() => {
    if (myInvitations.length === 0) return null;
    const future = myInvitations.filter(i => new Date(i.date) > new Date());
    return future.sort((a,b) => new Date(a.date) - new Date(b.date))[0];
  }, [myInvitations]);

  const [countdown, setCountdown] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    if (!closestWedding) return;
    const interval = setInterval(() => {
      const diff = new Date(closestWedding.date).getTime() - new Date().getTime();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [closestWedding]);

  const [showDailyReward, setShowDailyReward] = useState(false);

  useEffect(() => {
    const lastClaim = localStorage.getItem('last_daily_claim');
    const today = new Date().toDateString();
    if (lastClaim !== today) {
      setTimeout(() => setShowDailyReward(true), 1500);
    }
  }, []);

  const claimDailyReward = () => {
    const today = new Date().toDateString();
    localStorage.setItem('last_daily_claim', today);
    handleSnakeEarnCoins(50); // Use context method
    setShowDailyReward(false);
  };

  return (
    <AnimatedPage className="page-container" style={{ paddingBottom: '120px' }}>
      <AnimatePresence>
        {showDailyReward && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.5, y: 100 }}
              style={{ background: 'var(--card-bg)', padding: '3rem 2rem', borderRadius: '40px', textAlign: 'center', maxWidth: '350px', width: '90%', border: '2px solid var(--primary)', boxShadow: '0 0 50px var(--primary-light)' }}
            >
               <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎁</div>
               <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '10px' }}>{lang === 'uz' ? 'Kunlik Sovg\'a!' : 'Daily Reward!'}</h2>
               <p style={{ opacity: 0.8, marginBottom: '2rem' }}>{lang === 'uz' ? 'Bugun kirganingiz uchun +50 Tanga!' : '+50 Coins for logging in today!'}</p>
               <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f1c40f', marginBottom: '2rem' }}>+50 🪙</div>
               <button 
                onClick={claimDailyReward}
                className="btn-luxury" 
                style={{ width: '100%', padding: '15px', borderRadius: '20px', fontSize: '1.1rem' }}
               >
                 {lang === 'uz' ? 'QABUL QILISH' : 'CLAIM'}
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero Countdown / Welcome */}
      <section className="card" style={{ 
        padding: '3rem 2rem', marginBottom: '2.5rem', 
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        color: 'white', borderRadius: '35px', overflow: 'hidden', position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.2 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>{langConfig.welcome}, {user.username}! ✨</h2>
          {closestWedding ? (
            <div style={{ marginTop: '2rem' }}>
              <p style={{ opacity: 0.8, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{langConfig.countdown}</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', alignItems: 'baseline' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{countdown.days}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{langConfig.days}</div>
                </div>
                <div style={{ fontSize: '2rem', opacity: 0.5 }}>:</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{countdown.hours}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{langConfig.hours}</div>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '50px', display: 'inline-block', backdropFilter: 'blur(5px)' }}>
                📍 {closestWedding.groom} & {closestWedding.bride}
              </div>
            </div>
          ) : (
            <p style={{ opacity: 0.8, marginTop: '1rem' }}>{langConfig.welcomeDesc}! 💍</p>
          )}
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* 2. Quick Stats & Budget Idea */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <CoinIcon size={28} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{langConfig.availableCoins}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{coins}</div>
            </div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
               <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>💰 {langConfig.budget}</div>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45% {langConfig.spentBudget}</div>
            </div>
            <div style={{ height: '10px', background: 'var(--bg-main)', borderRadius: '10px', overflow: 'hidden' }}>
               <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }} />
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{langConfig.planBudget}: $5,000 / {langConfig.spentBudget}: $2,250</div>
          </div>
        </div>

        {/* 3. Media Gallery */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>📸</span> {langConfig.gallery}
            </h3>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
              style={{ padding: '8px 20px', borderRadius: '50px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {langConfig.createBtn}
            </motion.button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
             {myInvitations.length > 0 ? (
               myInvitations.map(inv => (
                 <motion.div 
                   key={inv.id} whileHover={{ y: -8 }} 
                   onClick={() => navigate(`/i/${inv.shortName}`)}
                   className="card"
                   style={{ cursor: 'pointer', borderRadius: '24px', overflow: 'hidden', padding: '0', border: '1px solid var(--border-color)' }}
                 >
                   <div style={{ height: '160px', position: 'relative', background: 'var(--primary-light)' }}>
                      {inv.photo ? <img src={inv.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={40} opacity={0.2}/></div>}
                      <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold' }}>{inv.shortName}</div>
                   </div>
                   <div style={{ padding: '1.2rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{inv.groom} & {inv.bride}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{inv.venue}</div>
                   </div>
                 </motion.div>
               ))
             ) : (
               <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>{langConfig.gallery} (Empty)</p>
                  <button onClick={() => navigate('/create')} className="btn-luxury" style={{ marginTop: '1rem' }}>{langConfig.createBtn} ✨</button>
               </div>
             )}
          </div>
        </section>

        {/* 4. Vazifalar Ro'yxati */}
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>📝</span> {langConfig.tasks}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {tasks.filter(t => t.completed).length} / {tasks.length} {langConfig.active}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <input 
              value={newTask} onChange={e => setNewTask(e.target.value)}
              placeholder="..." className="auth-input" style={{ flex: 1 }}
              onKeyPress={e => e.key === 'Enter' && addTask()}
            />
            <button onClick={addTask} className="btn-luxury" style={{ padding: '0 20px', borderRadius: '15px' }}>{langConfig.addBtn}</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AnimatePresence>
              {tasks.map(task => (
                <motion.div 
                  key={task.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: '15px', border: '1px solid var(--border-color)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1, fontWeight: '500' }}>
                      {task.text}
                    </span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer' }}>✕</button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* 5. Premium Kalendar Widget */}
        <section className="card calendar-card" style={{ padding: 'clamp(1rem, 5vw, 2rem)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
             <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'clamp(1rem, 4vw, 1.3rem)' }}>
               <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CalendarIcon size={16} color="white" />
               </div>
               <span style={{ whiteSpace: 'nowrap' }}>{langConfig.cal}</span>
             </h3>
             <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-main)', padding: '4px', borderRadius: '12px', alignItems: 'center', marginLeft: 'auto' }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handlePrevMonth} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><ChevronLeft size={16} /></motion.button>
                <div style={{ padding: '4px 10px', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{date.toLocaleString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short' })}</div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleNextMonth} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><ChevronRight size={16} /></motion.button>
             </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
            {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map(d => <div key={d} style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.75rem', paddingBottom: '10px' }}>{d}</div>)}
            {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => <div key={`empty-${i}`}></div>)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = selectedDay === dayNum;
              const isActualToday = new Date().getDate() === dayNum && new Date().getMonth() === currentMonth;
              return (
                <motion.div 
                  whileHover={{ scale: 1.15, background: 'var(--bg-main)', zIndex: 2 }}
                  key={i} 
                  onClick={() => setSelectedDay(dayNum)}
                  style={{ 
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '15px', cursor: 'pointer', fontSize: '0.95rem',
                    background: isSelected ? 'var(--primary)' : isActualToday ? 'var(--primary-light)' : 'transparent',
                    color: isSelected ? 'white' : 'inherit',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    border: isActualToday && !isSelected ? '2px solid var(--primary)' : '1px solid transparent',
                    boxShadow: isSelected ? '0 8px 20px var(--primary-light)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                  {dayNum}
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {selectedDay && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                key={selectedDay}
                style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--primary-light)', borderRadius: '25px', position: 'relative' }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '5px' }}>{selectedDay}-{date.toLocaleString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'long' })}</div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{lang === 'uz' ? 'Ushbu kun uchun reja kiritilmagan.' : lang === 'ru' ? 'План на этот день не введен.' : 'No plan entered for this day.'} ✨</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
