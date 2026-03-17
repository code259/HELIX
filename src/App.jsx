import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, User as UserIcon, Shield } from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import DatabasePage from './pages/DatabasePage';
import EvaluationPage from './pages/EvaluationPage';
import MethodologyPage from './pages/MethodologyPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="container flex-between h-full">
        <Link to="/" className="logo-text" onClick={closeMenu}>
          <Activity size={24} style={{ color: 'var(--color-primary)' }} />
          HELIX
        </Link>

        {/* Desktop Nav */}
        <nav className={`nav-links ${isMenuOpen ? 'mobile-active' : ''}`}>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>Platform</NavLink>
          <NavLink to="/database" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>Database</NavLink>
          <NavLink to="/evaluate" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>Evaluate</NavLink>
          <NavLink to="/methodology" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>Methodology</NavLink>
          <NavLink to="/results" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>Results</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="admin-profile-container">
              <div className="flex items-center gap-2 bg-surface p-1 pr-2 rounded-full border border-border">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                  {isAdmin ? <Shield size={16} /> : <UserIcon size={16} />}
                </div>
                <span className="text-sm font-medium text-text-main hidden lg:block whitespace-nowrap">
                  {user.username}
                  {isAdmin && <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Admin</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-ghost p-1.5 text-text-muted hover:text-red-500 rounded-full transition-all flex items-center justify-center"
                  style={{ border: 'none', background: 'transparent' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>

              {isAdmin && (
                <div className="admin-tooltip glass-panel p-2 shadow-xl">
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-sm font-medium text-gray-300 hover:text-white transition-all"
                  >
                    <Activity size={16} className="text-primary" />
                    Admin Dashboard
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm px-4" onClick={closeMenu}>
              Login
            </Link>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            className="md:hidden p-2 text-text-main hover:bg-surface-hover rounded-full transition-all border border-transparent hover:border-border"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          HELIX Platform &copy; 2026. A Multi-Model Computational Platform for Selective RecA Inhibitor Discovery.
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/evaluate" element={<EvaluationPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
