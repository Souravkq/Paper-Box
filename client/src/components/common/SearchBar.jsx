/**
 * SearchBar
 * Real-time autocomplete search with category filter
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { categoryIcons } from '../../utils/categories';
import './SearchBar.css';

const CATEGORIES = ['All', 'Education', 'Agriculture', 'Business', 'Health', 'Housing', 'Women', 'SC/ST', 'General'];

export default function SearchBar({ large = false }) {
  const [query, setQuery]           = useState('');
  const [category, setCategory]     = useState('All');
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const { user }                    = useAuth();
  const navigate                    = useNavigate();
  const debounceRef                 = useRef(null);
  const inputRef                    = useRef(null);

  // Debounced fetch suggestions
  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get(`/search/suggestions?q=${encodeURIComponent(q)}`);
      setSuggestions(data);
      setShowDrop(true);
    } catch { setSuggestions([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 280);
    return () => clearTimeout(debounceRef.current);
  }, [query, fetchSuggestions]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!query.trim() && category === 'All') return;
    setShowDrop(false);
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category !== 'All') params.set('category', category);
    navigate(`/schemes?${params.toString()}`);
  };

  const pickSuggestion = (s) => {
    setQuery(s.title);
    setShowDrop(false);
    navigate(`/schemes/${s._id}`);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.search-bar')) setShowDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <form
      className={`search-bar ${large ? 'search-bar--large' : ''}`}
      onSubmit={handleSearch}
    >
      {/* Category filter */}
      <div className="search-bar__category">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          aria-label="category"
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c === 'All' ? '🔍 All' : `${categoryIcons[c] || ''} ${c}`}
            </option>
          ))}
        </select>
      </div>

      <div className="search-bar__divider" />

      {/* Text input */}
      <div className="search-bar__input-wrap">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => suggestions.length && setShowDrop(true)}
          placeholder={`Search schemes${user ? ` for ${user.userType}s` : ''}...`}
          className="search-bar__input"
          autoComplete="off"
        />

        {loading && <span className="search-bar__spinner" />}

        {/* Autocomplete dropdown */}
        {showDrop && suggestions.length > 0 && (
          <ul className="search-bar__dropdown">
            {suggestions.map(s => (
              <li
                key={s._id}
                className="search-bar__suggestion"
                onMouseDown={() => pickSuggestion(s)}
              >
                <span className="search-bar__sug-icon">
                  {categoryIcons[s.category] || '📋'}
                </span>
                <span className="search-bar__sug-title">{s.title}</span>
                <span className="search-bar__sug-cat">{s.category}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className="btn btn-primary search-bar__btn">
        Search
      </button>
    </form>
  );
}
