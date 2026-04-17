/**
 * Navbar Component
 * Scroll-aware, responsive navbar with hamburger menu
 */
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar({ darkMode, toggleDark }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  // Show shadow when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { to: '/',         label: 'Home' },
    { to: '/schemes',  label: 'Schemes' },
    { to: '/about',    label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/contact',  label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">📦</span>
          <span>Paper<b>Box</b></span>
        </Link>

        {/* Desktop nav links */}
        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`navbar__link ${location.pathname === l.to ? 'navbar__link--active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className={`navbar__link ${location.pathname.includes('dashboard') || location.pathname.includes('admin') ? 'navbar__link--active' : ''}`}
              >
                {isAdmin ? '⚙️ Admin' : '📊 Dashboard'}
              </Link>
            </li>
          )}
        </ul>

        {/* Right actions */}
        <div className="navbar__actions">
          {/* Dark mode toggle */}
          <button
            className="navbar__icon-btn"
            onClick={toggleDark}
            title="Toggle dark mode"
            aria-label="toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="navbar__user">
              <span className="navbar__user-name">
                {user.name.split(' ')[0]}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
