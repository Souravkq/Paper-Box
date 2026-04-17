import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">📦 Paper<b>Box</b></Link>
          <p>Simplifying access to government subsidies with AI-powered discovery.</p>
          <div className="footer__socials">
            <a href="#" aria-label="twitter">𝕏</a>
            <a href="#" aria-label="linkedin">in</a>
            <a href="#" aria-label="github">⌥</a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Platform</h4>
          <Link to="/schemes">Browse Schemes</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer__col">
          <h4>Categories</h4>
          <Link to="/schemes?category=Education">Education</Link>
          <Link to="/schemes?category=Agriculture">Agriculture</Link>
          <Link to="/schemes?category=Business">Business</Link>
          <Link to="/schemes?category=Health">Health</Link>
        </div>

        <div className="footer__col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <span>© 2024 PaperBox. Built for India 🇮🇳</span>
          <span>Made with ❤️ for the people</span>
        </div>
      </div>
    </footer>
  );
}
