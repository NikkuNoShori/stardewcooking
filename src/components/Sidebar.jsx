import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';

// Junimo SVG — a cute little spirit
function Junimo({ color = '#66bb6a', size = 20 }) {
  return (
    <svg viewBox="0 0 24 28" width={size} height={size} className="junimo" aria-hidden="true">
      {/* antenna */}
      <path d="M12 2 Q14 0 15 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="15" cy="3.5" r="1.2" fill={color} />
      {/* body */}
      <ellipse cx="12" cy="16" rx="9" ry="10" fill={color} />
      {/* eyes */}
      <ellipse cx="9" cy="14" rx="1.8" ry="2.2" fill="#1a1a1a" />
      <ellipse cx="15" cy="14" rx="1.8" ry="2.2" fill="#1a1a1a" />
      {/* eye shine */}
      <circle cx="9.8" cy="13.2" r=".7" fill="#fff" />
      <circle cx="15.8" cy="13.2" r=".7" fill="#fff" />
      {/* feet */}
      <ellipse cx="8" cy="25" rx="3" ry="2" fill={color} />
      <ellipse cx="16" cy="25" rx="3" ry="2" fill={color} />
    </svg>
  );
}

const NAV_ITEMS = [
  {
    key: '/',
    label: 'Cooking',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6 2 10c0 2.5 1.5 4.5 3 6v4a1 1 0 001 1h12a1 1 0 001-1v-4c1.5-1.5 3-3.5 3-6 0-4-4.48-8-10-8z" />
        <path d="M8 21v-2h8v2" />
      </svg>
    ),
  },
  {
    key: '/community-center',
    label: 'Community Center',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V9l9-7 9 7v12" />
        <path d="M9 21V13h6v8" />
        <path d="M1 10l11-8 11 8" />
        <circle cx="12" cy="9" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className={`sidebar-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />

      <nav className={`sidebar${isOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo" onClick={() => handleNav('/')}>
          <Junimo color="#66bb6a" size={28} />
          <div className="sidebar-logo-text">
            <span className="sidebar-title">Stardew</span>
            <span className="sidebar-title">Cooking</span>
          </div>
          <Junimo color="#e57373" size={28} />
        </div>

        <div className="sidebar-divider" />

        {/* Nav items */}
        <div className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`sidebar-item${location.pathname === item.key ? ' active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Decorative Junimos */}
        <div className="sidebar-junimos">
          <Junimo color="#64b5f6" size={16} />
          <Junimo color="#ffb74d" size={16} />
          <Junimo color="#ce93d8" size={16} />
          <Junimo color="#81c784" size={16} />
          <Junimo color="#ef5350" size={16} />
          <Junimo color="#4dd0e1" size={16} />
        </div>

        {/* User section */}
        <div className="sidebar-footer">
          <div className="sidebar-divider" />
          {user ? (
            <div className="sidebar-user">
              <span className="sidebar-user-email">{user.email}</span>
              <button className="sidebar-signout" onClick={signOut}>Sign Out</button>
            </div>
          ) : (
            <button className="sidebar-signin" onClick={() => setShowAuthModal(true)}>
              Sign In to Sync
            </button>
          )}
        </div>
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
