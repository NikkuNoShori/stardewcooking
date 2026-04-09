import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DISCLAIMER_KEY = 'stardew-disclaimer-accepted';

// Reuse the Junimo SVG from Sidebar
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

const FEATURES = [
  { icon: '📦', title: 'Community Center', desc: 'Check off Community Center bundles room by room.', path: '/community-center' },
  { icon: '🍳', title: 'Cooking', desc: 'Track every recipe and ingredient you need to cook them all.', path: '/cooking' },
  { icon: '⚒️', title: 'Crafting', desc: 'Monitor crafting recipes you\'ve unlocked and completed.', path: '/crafting' },
  { icon: '🐟', title: 'Fishing', desc: 'Log your catches with season, weather, and location info.', path: '/fish' },
  { icon: '🏝️', title: 'Ginger Island', desc: 'Track Ginger Island collectibles and objectives.', path: '/island' },
  { icon: '🔎', title: 'Misc', desc: 'Track miscellaneous completion goals and achievements.', path: '/misc' },
  { icon: '🏺', title: 'Museum', desc: 'Keep tabs on minerals and artifacts for Gunther.', path: '/museum' },
  { icon: '📤', title: 'Shipping', desc: 'Track every item shipped toward full completion.', path: '/shipping' },
  { icon: '🔒', title: 'Spawn Codes', desc: 'Cheat / Spoiler', path: '/spawn-codes', cheat: true },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(DISCLAIMER_KEY);
    if (!accepted) {
      setShowDisclaimer(true);
    }
  }, []);

  const acceptDisclaimer = () => {
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    setShowDisclaimer(false);
  };

  return (
    <div className="landing">
      {/* Disclaimer modal */}
      {showDisclaimer && (
        <div className="landing-disclaimer-overlay">
          <div className="landing-disclaimer-modal">
            <div className="landing-disclaimer-title">Before You Begin</div>
            <p className="landing-disclaimer-text">
              This is a fan-made app that references data and community content from the{' '}
              <a href="https://stardewvalleywiki.com" target="_blank" rel="noreferrer">Stardew Valley Wiki</a>
              {' '}(licensed under{' '}
              <a href="https://stardewvalleywiki.com/Stardew_Valley_Wiki:Copyrights" target="_blank" rel="noreferrer">CC BY-NC-SA 3.0</a>
              ). Stardew Valley names, images, and game assets are property of ConcernedApe and respective licensors.
            </p>
            <p className="landing-disclaimer-text">
              This app is not affiliated with or endorsed by ConcernedApe.
            </p>
            <button className="landing-disclaimer-btn" onClick={acceptDisclaimer}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-junimos">
          <Junimo color="#66bb6a" size={36} />
          <Junimo color="#64b5f6" size={36} />
          <Junimo color="#ffb74d" size={36} />
          <Junimo color="#ce93d8" size={36} />
          <Junimo color="#ef5350" size={36} />
          <Junimo color="#4dd0e1" size={36} />
        </div>
        <h1 className="landing-title">Stardew Completionist</h1>
        <p className="landing-subtitle">
          Your all-in-one progress tracker for 100% completion in Stardew Valley.
        </p>
        <button className="landing-cta" onClick={() => navigate('/cooking')}>
          Start Tracking
        </button>
      </section>

      {/* Features grid */}
      <section className="landing-features">
        <h2 className="landing-section-title">Everything You Need to Track</h2>
        <div className="landing-features-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`landing-feature-card${f.cheat ? ' landing-feature-cheat' : ''}`}
              onClick={() => navigate(f.path)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(f.path)}
            >
              <span className="landing-feature-icon">{f.icon}</span>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sync callout */}
      <section className="landing-sync">
        <div className="landing-sync-inner">
          <h2 className="landing-section-title">Sync Across Devices</h2>
          <p className="landing-sync-desc">
            Create a free account to save your progress and pick up where you left off on any device.
            Your data stays yours — no tracking, no ads.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="landing-bottom">
        <div className="landing-hero-junimos">
          <Junimo color="#81c784" size={28} />
          <Junimo color="#e57373" size={28} />
          <Junimo color="#64b5f6" size={28} />
        </div>
        <button className="landing-cta" onClick={() => navigate('/cooking')}>
          Get Started
        </button>
      </section>
    </div>
  );
}
