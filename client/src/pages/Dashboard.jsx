/**
 * User Dashboard
 * Personalized hub with recommendations, history, and quick actions
 */
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import SchemeCard from '../components/common/SchemeCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { userTypeIcons } from '../utils/categories';
import './Dashboard.css';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [recentViewed, setRecentViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const [recRes, profileRes] = await Promise.all([
          api.get('/schemes/recommended'),
          api.get('/users/profile')
        ]);
        setRecommended(recRes.data);
        setRecentViewed(profileRes.data.recentlyViewed || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const icon = userTypeIcons[user.userType] || '👤';

  return (
    <div className="dashboard page-enter">
      {/* ─── Welcome header ───────────────────────────────────────────────── */}
      <section className="dashboard__hero">
        <div className="container dashboard__hero-inner">
          <div className="dashboard__avatar">{icon}</div>
          <div>
            <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p>{user.userType} · {user.email}</p>
          </div>
          <div className="dashboard__hero-actions">
            <Link to="/schemes" className="btn btn-primary">Browse All Schemes</Link>
          </div>
        </div>
      </section>

      <div className="container dashboard__body">
        {/* ─── Quick stats ──────────────────────────────────────────────────── */}
        <div className="dashboard__stats">
          {[
            { icon: '🎯', label: 'Personalized For You', value: user.userType },
            { icon: '👁️', label: 'Recently Viewed', value: `${recentViewed.length} schemes` },
            { icon: '🔍', label: 'Searches Made', value: `${user.searchHistory?.length || 0} searches` },
            { icon: '🤖', label: 'AI Chatbot', value: 'Available 24/7' },
          ].map(s => (
            <div key={s.label} className="dashboard__stat card">
              <span className="dashboard__stat-icon">{s.icon}</span>
              <div>
                <div className="dashboard__stat-value">{s.value}</div>
                <div className="dashboard__stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Recommended section ──────────────────────────────────────────── */}
        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <div>
              <h2>Recommended for You</h2>
              <p>Schemes matched to your {user.userType} profile</p>
            </div>
            <Link to="/schemes" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div className="dashboard__grid">
            {loading
              ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : recommended.slice(0, 6).map((s, i) => (
                  <SchemeCard key={s._id} scheme={s} delay={i * 80} />
                ))
            }
          </div>
        </section>

        {/* ─── Recently Viewed ──────────────────────────────────────────────── */}
        {recentViewed.length > 0 && (
          <section className="dashboard__section">
            <div className="dashboard__section-header">
              <div>
                <h2>Recently Viewed</h2>
                <p>Continue exploring where you left off</p>
              </div>
            </div>
            <div className="dashboard__grid">
              {recentViewed.slice(0, 3).map((s, i) => (
                <SchemeCard key={s._id} scheme={s} delay={i * 80} />
              ))}
            </div>
          </section>
        )}

        {/* ─── Quick Actions ────────────────────────────────────────────────── */}
        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <div><h2>Quick Actions</h2></div>
          </div>
          <div className="dashboard__actions-grid">
            {[
              { icon: '🔍', label: 'Search Schemes', desc: 'Find specific subsidies', to: '/schemes' },
              { icon: '🤖', label: 'Ask AI',         desc: 'Get personalized help', action: () => document.querySelector('.chatbot__fab')?.click() },
              { icon: '📞', label: 'Contact Us',     desc: 'Get support',            to: '/contact' },
              { icon: '📖', label: 'Learn More',     desc: 'Platform guide',         to: '/about' },
            ].map(a => (
              a.to ? (
                <Link key={a.label} to={a.to} className="dashboard__action card">
                  <span>{a.icon}</span>
                  <div>
                    <div className="dashboard__action-label">{a.label}</div>
                    <div className="dashboard__action-desc">{a.desc}</div>
                  </div>
                </Link>
              ) : (
                <button key={a.label} className="dashboard__action card" onClick={a.action}>
                  <span>{a.icon}</span>
                  <div>
                    <div className="dashboard__action-label">{a.label}</div>
                    <div className="dashboard__action-desc">{a.desc}</div>
                  </div>
                </button>
              )
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
