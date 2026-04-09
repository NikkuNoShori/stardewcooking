import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';

// Decorative custom SVG mascots (not game asset extracts)
function Junimo({ color = '#66bb6a', size = 20 }) {
  return (
    <svg viewBox="0 0 24 28" width={size} height={size} className="junimo" aria-hidden="true">
      <path d="M12 2 Q14 0 15 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="15" cy="3.5" r="1.2" fill={color} />
      <ellipse cx="12" cy="16" rx="9" ry="10" fill={color} />
      <ellipse cx="9" cy="14" rx="1.8" ry="2.2" fill="#1a1a1a" />
      <ellipse cx="15" cy="14" rx="1.8" ry="2.2" fill="#1a1a1a" />
      <circle cx="9.8" cy="13.2" r=".7" fill="#fff" />
      <circle cx="15.8" cy="13.2" r=".7" fill="#fff" />
      <ellipse cx="8" cy="25" rx="3" ry="2" fill={color} />
      <ellipse cx="16" cy="25" rx="3" ry="2" fill={color} />
    </svg>
  );
}

const NAV_ITEMS = [
  { key: '/community-center', label: 'Bundles' },
  { key: '/cooking', label: 'Cooking' },
  { key: '/crafting', label: 'Crafting' },
  { key: '/fish', label: 'Fish' },
  { key: '/island', label: 'Ginger Island' },
  { key: '/misc', label: 'Misc' },
  { key: '/museum', label: 'Museum' },
  { key: '/shipping', label: 'Shipping' },
  { key: '/spawn-codes', label: 'Spawn Codes', cheat: true },
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
        <div className="sidebar-logo" onClick={() => handleNav('/cooking')}>
          <Junimo color="#66bb6a" size={28} />
          <div className="sidebar-logo-text">
            <span className="sidebar-title">Stardew</span>
            <span className="sidebar-title">Completionist</span>
          </div>
          <Junimo color="#e57373" size={28} />
        </div>

        <div className="sidebar-divider" />

        {/* Nav items */}
        <div className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`sidebar-item${location.pathname === item.key ? ' active' : ''}${item.cheat ? ' sidebar-cheat' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Decorative custom Junimos */}
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
