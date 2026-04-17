/**
 * SchemeDetail Page
 * Full details for a single government scheme
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { getCategoryStyle, categoryIcons } from '../utils/categories';
import SkeletonCard from '../components/common/SkeletonCard';
import './SchemeDetail.css';

export default function SchemeDetail() {
  const { id }                = useParams();
  const [scheme, setScheme]   = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/schemes/${id}`);
        setScheme(data);
        // Fetch related same-category schemes
        const rel = await api.get(`/schemes?category=${data.category}&limit=3`);
        setRelated((rel.data.schemes || []).filter(s => s._id !== id));
      } catch { setScheme(null); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="container" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <SkeletonCard /><SkeletonCard />
      </div>
    </div>
  );

  if (!scheme) return (
    <div className="scheme-detail__error">
      <span>😕</span>
      <h2>Scheme not found</h2>
      <Link to="/schemes" className="btn btn-primary">Back to Schemes</Link>
    </div>
  );

  const style = getCategoryStyle(scheme.category);
  const icon  = categoryIcons[scheme.category] || '📋';

  return (
    <div className="scheme-detail page-enter">
      {/* ─── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="scheme-detail__breadcrumb">
        <div className="container">
          <Link to="/">Home</Link> /
          <Link to="/schemes"> Schemes</Link> /
          <span> {scheme.title}</span>
        </div>
      </div>

      <div className="container scheme-detail__body">
        {/* ─── Main Content ────────────────────────────────────────────────── */}
        <div className="scheme-detail__main">
          {/* Header card */}
          <div className="scheme-detail__header card">
            <div
              className="scheme-detail__category-bar"
              style={{ background: `linear-gradient(90deg, ${style.border}, transparent)` }}
            />
            <div className="scheme-detail__header-inner">
              <div className="scheme-detail__icon" style={{ background: style.bg, color: style.text }}>
                {icon}
              </div>
              <div>
                <span className="badge" style={{ background: style.bg, color: style.text }}>
                  {scheme.category}
                </span>
                <h1 className="scheme-detail__title">{scheme.title}</h1>
                {scheme.ministry && (
                  <p className="scheme-detail__ministry">🏛️ {scheme.ministry}</p>
                )}
              </div>
            </div>

            {/* Target users */}
            {scheme.targetUsers?.length > 0 && (
              <div className="scheme-detail__targets">
                <span className="scheme-detail__targets-label">Best for:</span>
                {scheme.targetUsers.map(u => (
                  <span key={u} className="badge badge-blue">{u}</span>
                ))}
              </div>
            )}

            {/* Tags */}
            {scheme.tags?.length > 0 && (
              <div className="scheme-detail__tags">
                {scheme.tags.map(t => (
                  <span key={t} className="scheme-detail__tag">#{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Details sections */}
          <div className="scheme-detail__sections">
            {[
              { icon: '📋', label: 'Overview', content: scheme.description },
              { icon: '✅', label: 'Eligibility', content: scheme.eligibility },
              { icon: '🎁', label: 'Benefits', content: scheme.benefits },
              { icon: '📝', label: 'How to Apply', content: scheme.applicationProcess },
            ].map(({ icon: ic, label, content }) => content && (
              <div key={label} className="scheme-detail__section card">
                <h2><span>{ic}</span> {label}</h2>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="scheme-detail__sidebar">
          {/* Apply CTA */}
          <div className="scheme-detail__apply card">
            <h3>Ready to Apply?</h3>
            <p>Visit the official government portal to apply for this scheme.</p>
            {scheme.link ? (
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Apply Now →
              </a>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Contact Office
              </button>
            )}
            <div className="scheme-detail__views">
              👁️ {scheme.views || 0} people viewed this
            </div>
          </div>

          {/* Ask AI */}
          <div className="scheme-detail__ai-card card">
            <span className="scheme-detail__ai-icon">🤖</span>
            <h3>Not sure you qualify?</h3>
            <p>Ask our AI assistant for personalized guidance.</p>
            <button
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => document.querySelector('.chatbot__fab')?.click()}
            >
              Ask AI Assistant
            </button>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="scheme-detail__related">
              <h3>Related Schemes</h3>
              {related.map(r => {
                const rs = getCategoryStyle(r.category);
                return (
                  <Link key={r._id} to={`/schemes/${r._id}`} className="scheme-detail__related-item card">
                    <span style={{ background: rs.bg, color: rs.text }} className="scheme-detail__related-icon">
                      {categoryIcons[r.category]}
                    </span>
                    <div>
                      <div className="scheme-detail__related-title">{r.title}</div>
                      <div className="scheme-detail__related-cat">{r.category}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
