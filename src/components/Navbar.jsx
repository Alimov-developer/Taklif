import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Coins as CoinIcon, PlusSquare, User, Settings as SettingsIcon, Star, Gamepad2 } from 'lucide-react';
import AppContext from '../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const { langConfig, coins } = useContext(AppContext);
  
  const navItems = [
    { path: '/games', label: langConfig.games, icon: <Gamepad2 size={18} /> },
    { path: '/', label: langConfig.dashboard, icon: <Home size={18} /> },
    { path: '/mining', label: langConfig.mining, icon: <CoinIcon size={18} /> },
    { path: '/create', label: langConfig.create, icon: <PlusSquare size={18} /> },
    { path: '/profile', label: langConfig.profile, icon: <User size={18} /> },
    { path: '/settings', label: langConfig.settings, icon: <SettingsIcon size={18} /> },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
         <Star fill="var(--primary)" size={20} style={{marginRight: '5px', verticalAlign: 'middle'}}/>Taklif
      </Link>
      <div className="header-coin-banner">
        <span className="coin-icon">🪙</span>
        <span>{coins}</span>
      </div>
      <div className="nav-links">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
