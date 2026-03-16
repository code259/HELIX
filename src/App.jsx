import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

import LandingPage from './pages/LandingPage';
import DatabasePage from './pages/DatabasePage';
import EvaluationPage from './pages/EvaluationPage';
import MethodologyPage from './pages/MethodologyPage';
import ResultsPage from './pages/ResultsPage';

function Navbar() {
  return (
    <header className="header">
      <div className="container flex-between">
        <Link to="/" className="logo-text">
          <Activity size={24} style={{ color: 'var(--color-primary)' }} />
          HELIX
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Platform</NavLink>
          <NavLink to="/database" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Database</NavLink>
          <NavLink to="/evaluate" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Evaluate</NavLink>
          <NavLink to="/methodology" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Methodology</NavLink>
          <NavLink to="/results" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Results</NavLink>
        </nav>
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
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/evaluate" element={<EvaluationPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
