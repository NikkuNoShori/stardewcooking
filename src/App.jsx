import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import CommunityCenter from './pages/CommunityCenter';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hamburger button */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <span /><span /><span />
      </button>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community-center" element={<CommunityCenter />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
