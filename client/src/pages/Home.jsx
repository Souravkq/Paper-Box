/**
 * Home Page
 * Hero, smart search, recommendations, recent schemes
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/common/SearchBar';
import SchemeCard from '../components/common/SchemeCard';
import SkeletonCard from '../components/common/SkeletonCard';
import api from '../utils/api';
import './Home.css';

const STATS = [
  { value: '500+', label: 'Government Schemes' },
  { value: '12+',  label: 'Categories' },
  { value: '50K+', label: 'Users Helped' },
  { value: 'AI',   label: 'Powered Search' },
];

const FEATURES = [
  { icon: '🧠', title: 'AI-Powered',      desc: 'Gemini AI suggests schemes tailored to your profile' },
  { icon: '⚡', title: 'Instant Search',  desc: 'Find the right subsidy in seconds with smart filtering' },
  { icon: '🎯', title: 'Personalized',    desc: 'Recommendations based on your user type and history' },
  { icon: '🔔', title: 'Stay Updated',    desc: 'Never miss new schemes relevant to you' },
];

export default function Home() {
  const { user }               = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [recent, setRecent]           = useState([]);
  const [loadRec, setLoadRec]         = useState(true);
  const [loadRec2, setLoadRec2]       = useState(true);

  useEffect(() => {
    // Fetch recommended schemes (personalized if logged in)
    const fetchRec = async () => {
      try {
        const url = user ? '/schemes/recommended' : '/schemes?limit=6';
        const { data } = await api.get(url);
        setRecommended(user ? data : data.schemes || data);
      } catch { setRecommended([]); }
      finally { setLoadRec(false); }
    };

    // Fetch recent schemes
    const fetchRecent = async () => {
      try {
        const { data } = await api.get('/schemes?limit=3');
        setRecent(data.schemes || []);
      } catch { setRecent([]); }
      finally { setLoadRec2(false); }
    };

    fetchRec();
    fetchRecent();
  }, [user]);

  return (
    <div className="home page-enter">
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="container hero__content">
          <div className="hero__tag fade-in">🇮🇳 India's #1 Subsidy Discovery Platform</div>
          <h1 className="hero__title slide-up">
            Discover Government<br />
            <span className="hero__title-highlight">Benefits Made for You</span>
          </h1>
          <p className="hero__sub fade-in">
            Paper Box uses AI to match you with the right government schemes, subsidies, and welfare programs — based on who you are.
          </p>

          {/* Search bar */}
          <div className="hero__search fade-in">
            <SearchBar large />
          </div>

          {/* CTA buttons */}
          <div className="hero__cta fade-in">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/schemes" className="btn btn-outline btn-lg">
                  Browse Schemes
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="hero__stats">
            {STATS.map(s => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cards decoration */}
        <div className="hero__floats" aria-hidden="true">
          <div className="hero__float hero__float--1">🌾 PM Kisan</div>
          <div className="hero__float hero__float--2">🎓 Scholarship</div>
          <div className="hero__float hero__float--3">💼 MUDRA Loan</div>
          <div className="hero__float hero__float--4">🏠 Housing</div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────────── */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Paper Box</span>
            <h2>Smart Access to What You Deserve</h2>
            <p>We make government benefits easy to find, understand, and apply for.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="feature-card card fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="feature-card__icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recommended / Recent Schemes ─────────────────────────────────────── */}
      <section className="section schemes-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              {user ? `For ${user.userType}s` : 'Popular Schemes'}
            </span>
            <h2>
              {user ? `Recommended for You` : 'Top Government Schemes'}
            </h2>
            <p>Handpicked benefits based on your profile and needs.</p>
          </div>

          <div className="schemes-grid">
            {loadRec
              ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : recommended.map((s, i) => <SchemeCard key={s._id} scheme={s} delay={i * 80} />)
            }
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/schemes" className="btn btn-outline btn-lg">
              View All Schemes →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────────────────── */}
      {!user && (
        <section className="cta-banner">
          <div className="container cta-banner__inner">
            <div>
              <h2>Start Discovering Your Benefits Today</h2>
              <p>Create a free account and get personalized scheme recommendations instantly.</p>
            </div>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
