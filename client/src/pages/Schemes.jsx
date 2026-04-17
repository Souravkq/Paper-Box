/**
 * Schemes Page
 * Browse, filter, and search all government schemes
 */
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/common/SchemeCard';
import SkeletonCard from '../components/common/SkeletonCard';
import SearchBar from '../components/common/SearchBar';
import api from '../utils/api';
import { categoryIcons } from '../utils/categories';
import './Schemes.css';

const CATEGORIES = ['All', 'Education', 'Agriculture', 'Business', 'Health', 'Housing', 'Women', 'SC/ST', 'General'];

export default function Schemes() {
  const [schemes, setSchemes]     = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user }                  = useAuth();

  const qParam  = searchParams.get('q') || '';
  const catParam = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(catParam);

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 12, page });
      if (qParam) params.set('q', qParam);
      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (user?.userType) params.set('userType', user.userType);

      const endpoint = qParam ? `/search?${params}` : `/schemes?${params}`;
      const { data } = await api.get(endpoint);

      // Handle both search (array) and schemes (object) responses
      if (Array.isArray(data)) {
        setSchemes(data);
        setTotal(data.length);
      } else {
        setSchemes(data.schemes || []);
        setTotal(data.total || 0);
      }
    } catch { setSchemes([]); }
    finally { setLoading(false); }
  }, [qParam, activeCategory, page, user]);

  useEffect(() => { fetchSchemes(); }, [fetchSchemes]);

  // Sync URL param to active category
  useEffect(() => {
    setActiveCategory(catParam || 'All');
    setPage(1);
  }, [catParam]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  return (
    <div className="schemes-page page-enter">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <section className="schemes-hero">
        <div className="container">
          <div className="section-tag">Browse</div>
          <h1>All Government Schemes</h1>
          <p>
            {user
              ? `Showing results prioritized for ${user.userType}s`
              : 'Discover subsidies, loans, and benefits available to you'}
          </p>
          <div className="schemes-hero__search">
            <SearchBar large />
          </div>
        </div>
      </section>

      <div className="container schemes-body">
        {/* ─── Category Tabs ───────────────────────────────────────────────── */}
        <div className="schemes-cats">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`schemes-cat-btn ${activeCategory === cat ? 'schemes-cat-btn--active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat !== 'All' && <span>{categoryIcons[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* ─── Result count ────────────────────────────────────────────────── */}
        {!loading && (
          <div className="schemes-count">
            {qParam && <span>Results for "<b>{qParam}</b>" · </span>}
            <span>{total} scheme{total !== 1 ? 's' : ''} found</span>
            {user && <span className="schemes-count__tag">Sorted for {user.userType}s</span>}
          </div>
        )}

        {/* ─── Grid ────────────────────────────────────────────────────────── */}
        <div className="schemes-grid">
          {loading
            ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : schemes.length === 0
              ? (
                <div className="schemes-empty">
                  <span>🔍</span>
                  <h3>No schemes found</h3>
                  <p>Try a different search or category.</p>
                </div>
              )
              : schemes.map((s, i) => <SchemeCard key={s._id} scheme={s} delay={i * 50} />)
          }
        </div>

        {/* ─── Pagination ──────────────────────────────────────────────────── */}
        {!loading && total > 12 && (
          <div className="schemes-pagination">
            <button
              className="btn btn-ghost"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Previous
            </button>
            <span className="schemes-page-info">
              Page {page} of {Math.ceil(total / 12)}
            </span>
            <button
              className="btn btn-ghost"
              disabled={page >= Math.ceil(total / 12)}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
