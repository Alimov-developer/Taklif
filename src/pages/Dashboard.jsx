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
    <AnimatedPage className="page-container" style={{ paddingBottom: '120px', maxWidth: '1000px', margin: '0 auto' }}>
      <AnimatePresence>
        {showDailyReward && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)' }}
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100, rotate: -10 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.5, y: 100 }}
              style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)', padding: '3rem 2rem', borderRadius: '45px', textAlign: 'center', maxWidth: '380px', width: '90%', border: '2px solid rgba(212, 175, 55, 0.4)', boxShadow: '0 0 60px rgba(212, 175, 55, 0.2)' }}
            >
               <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '6rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 20px rgba(212, 175, 55, 0.3))' }}>🎁</motion.div>
               <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>{langConfig.dailyGift}</h2>
               <p style={{ opacity: 0.7, marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-dark)' }}>{langConfig.dailyBonus}</p>
               <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f1c40f', marginBottom: '2.5rem', textShadow: '0 0 20px rgba(241, 196, 15, 0.3)' }}>+50 🪙</div>
               <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={claimDailyReward}
                style={{ width: '100%', padding: '18px', borderRadius: '22px', fontSize: '1.2rem', background: 'linear-gradient(45deg, #d4af37, #f1c40f)', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)' }}
               >
                 {langConfig.claimReward}
               </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero Countdown / Welcome */}
      <section className="card" style={{ 
        padding: '3.5rem 2.5rem', marginBottom: '3rem', 
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        color: 'white', borderRadius: '40px', overflow: 'hidden', position: 'relative',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(120px)', zIndex: 0 }}></motion.div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.8rem', fontFamily: 'var(--font-serif)', letterSpacing: '1px' }}>{langConfig.welcome}, {user.username}! ✨</h2>
          {closestWedding ? (
            <div style={{ marginTop: '2.5rem' }}>
              <p style={{ opacity: 0.6, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>{langConfig.countdown}</p>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4.5rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>{countdown.days}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '5px' }}>{langConfig.days}</div>
                </div>
                <div style={{ fontSize: '3rem', opacity: 0.2, fontWeight: '200' }}>/</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4.5rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>{countdown.hours}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '5px' }}>{langConfig.hours}</div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} style={{ marginTop: '2rem', fontSize: '1rem', background: 'rgba(255,255,255,0.08)', padding: '12px 25px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span>📍</span> {closestWedding.groom} & {closestWedding.bride}
              </motion.div>
            </div>
          ) : (
            <p style={{ opacity: 0.7, marginTop: '1.2rem', fontSize: '1.1rem' }}>{langConfig.welcomeDesc}! 💍</p>
          )}
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* 2. Quick Stats & Budget */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '25px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(212, 175, 55, 0.1)' }}>
               <CoinIcon size={32} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{langConfig.availableCoins}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>{coins} 🪙</div>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '2rem', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
               <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>💰 {langConfig.budget}</div>
               <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>45% Used</div>
            </div>
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
               <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: '100%', background: 'linear-gradient(90deg, #d4af37, #f1c40f)', borderRadius: '10px' }} />
            </div>
              <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Plan: $5,000</span>
                <span style={{ color: 'var(--text-muted)' }}>Spent: $2,250</span>
              </div>
          </motion.div>
        </div>

        {/* 3. My Invitations */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.6rem', color: 'var(--text-dark)', fontFamily: 'var(--font-serif)' }}>
              <span style={{ fontSize: '1.8rem' }}>📸</span> {langConfig.gallery}
            </h3>
            <motion.button 
              whileHover={{ scale: 1.05, background: 'white', color: 'black' }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
              style={{ padding: '10px 25px', borderRadius: '50px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', transition: 'all 0.3s' }}
            >
              + {langConfig.createBtn}
            </motion.button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
             {myInvitations.length > 0 ? (
               myInvitations.map((inv, idx) => (
                 <motion.div 
                   key={inv.id} 
                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                   whileHover={{ y: -10 }} 
                   onClick={() => navigate(`/i/${inv.shortName}`)}
                   className="card"
                   style={{ cursor: 'pointer', borderRadius: '30px', overflow: 'hidden', padding: '0', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                 >
                   <div style={{ height: '180px', position: 'relative', background: 'rgba(255,255,255,0.05)' }}>
                      {inv.photo ? <img src={inv.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={50} opacity={0.1} color="white"/></div>}
                      <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: 'white', padding: '5px 15px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>{inv.shortName}</div>
                   </div>
                   <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>{inv.groom} & {inv.bride}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>📍</span> {inv.venue}
                      </div>
                   </div>
                 </motion.div>
               ))
             ) : (
               <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', border: '2px dashed rgba(255,255,255,0.1)', background: 'transparent' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{langConfig.gallery} (Empty)</p>
                  <button onClick={() => navigate('/create')} className="btn-luxury" style={{ marginTop: '1.5rem', padding: '12px 35px' }}>{langConfig.createBtn} ✨</button>
               </div>
             )}
          </div>
        </section>

        {/* 4. Tasks & Calendar (Bottom Grid) */}
        <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <section className="card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-dark)', fontSize: '1.4rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>📝</span> {langConfig.tasks}
                </h3>
                <div style={{ fontSize: '0.8rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '50px', fontWeight: 'bold' }}>
                  {tasks.filter(t => t.completed).length}/{tasks.length} Done
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem' }}>
                <input 
                  value={newTask} onChange={e => setNewTask(e.target.value)}
                  placeholder="New task..." className="auth-input" style={{ flex: 1, borderRadius: '15px', padding: '12px 20px', background: 'rgba(255,255,255,0.03)' }}
                  onKeyPress={e => e.key === 'Enter' && addTask()}
                />
                <button onClick={addTask} className="btn-luxury" style={{ padding: '0 20px', borderRadius: '15px', minWidth: '60px' }}>+</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                  {tasks.map(task => (
                    <motion.div 
                      key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} style={{ width: '22px', height: '22px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.4 : 1, fontWeight: '500', color: 'var(--text-dark)' }}>
                          {task.text}
                        </span>
                      </div>
                      <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.5 }}>✕</button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            <section className="card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
              <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                 <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-dark)', fontSize: '1.4rem' }}>
                   <div style={{ background: 'var(--primary)', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarIcon size={18} color="black" />
                   </div>
                   <span>{langConfig.cal}</span>
                 </h3>
                 <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '15px' }}>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={handlePrevMonth} style={{ background: 'transparent', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}><ChevronLeft size={18} /></motion.button>
                    <div style={{ padding: '0 10px', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary)' }}>{date.toLocaleString(lang === 'uz' ? 'uz-UZ' : 'en-US', { month: 'short' })}</div>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={handleNextMonth} style={{ background: 'transparent', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}><ChevronRight size={18} /></motion.button>
                 </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <div key={d} style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.7rem', opacity: 0.6 }}>{d}</div>)}
                {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDay === dayNum;
                  const isActualToday = new Date().getDate() === dayNum && new Date().getMonth() === currentMonth;
                  return (
                    <motion.div 
                      key={i} onClick={() => setSelectedDay(dayNum)}
                      style={{ 
                        aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem',
                        background: isSelected ? 'var(--primary)' : isActualToday ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                        color: isSelected ? '#000' : 'var(--text-dark)',
                        fontWeight: isSelected || isActualToday ? 'bold' : 'normal',
                        border: isActualToday ? '1px solid var(--primary)' : '1px solid transparent'
                      }}>
                      {dayNum}
                    </motion.div>
                  );
                })}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selectedDay} style={{ marginTop: '2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Plans for {selectedDay} {date.toLocaleString(lang === 'uz' ? 'uz-UZ' : 'en-US', { month: 'long' })}</div>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-dark)', fontSize: '0.9rem', opacity: 0.8 }}>No events planned yet. ✨</p>
                </motion.div>
              </AnimatePresence>
            </section>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
