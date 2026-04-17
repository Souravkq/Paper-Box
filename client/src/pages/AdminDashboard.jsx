/**
 * Admin Dashboard
 * Manage schemes, view users, feedback, and analytics
 */
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { getCategoryStyle, categoryIcons } from '../utils/categories';
import './AdminDashboard.css';

const CATEGORIES = ['Education', 'Agriculture', 'Business', 'Health', 'Housing', 'Women', 'SC/ST', 'General'];
const EMPTY_FORM = {
  title: '', description: '', category: '', eligibility: '',
  benefits: '', applicationProcess: '', ministry: '', link: '',
  targetUsers: [], tags: ''
};

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [tab, setTab]             = useState('schemes');
  const [schemes, setSchemes]     = useState([]);
  const [users, setUsers]         = useState([]);
  const [feedback, setFeedback]   = useState([]);
  const [stats, setStats]         = useState({});
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sRes, uRes, fRes, stRes] = await Promise.all([
          api.get('/schemes?limit=50'),
          api.get('/users/all'),
          api.get('/feedback'),
          api.get('/schemes/stats/overview'),
        ]);
        setSchemes(sRes.data.schemes || []);
        setUsers(uRes.data);
        setFeedback(fRes.data);
        setStats(stRes.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetchAll();
  }, [isAdmin]);

  if (authLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  /* ── Form helpers ── */
  const openNew  = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (s) => {
    setEditing(s._id);
    setForm({
      ...s,
      tags: (s.tags || []).join(', '),
      targetUsers: s.targetUsers || []
    });
    setShowForm(true);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const toggleTargetUser = (type) => {
    setForm(p => ({
      ...p,
      targetUsers: p.targetUsers.includes(type)
        ? p.targetUsers.filter(t => t !== type)
        : [...p.targetUsers, type]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (editing) {
        await api.put(`/schemes/${editing}`, payload);
        toast.success('Scheme updated!');
        setSchemes(prev => prev.map(s => s._id === editing ? { ...s, ...payload } : s));
      } else {
        const { data } = await api.post('/schemes', payload);
        toast.success('Scheme created!');
        setSchemes(prev => [data, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save scheme');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scheme?')) return;
    try {
      await api.delete(`/schemes/${id}`);
      setSchemes(prev => prev.filter(s => s._id !== id));
      toast.success('Scheme deleted');
    } catch { toast.error('Delete failed'); }
  };

  const deleteFeedback = async (id) => {
    try {
      await api.delete(`/feedback/${id}`);
      setFeedback(prev => prev.filter(f => f._id !== id));
      toast.success('Feedback removed');
    } catch {}
  };

  /* ── Analytics ── */
  const analyticsCards = [
    { icon: '📋', label: 'Total Schemes',   value: stats.total || 0,           color: 'blue' },
    { icon: '✅', label: 'Active Schemes',  value: stats.active || 0,          color: 'green' },
    { icon: '👥', label: 'Registered Users', value: users.length,              color: 'purple' },
    { icon: '💬', label: 'Feedback Entries', value: feedback.length,           color: 'yellow' },
  ];

  return (
    <div className="admin page-enter">
      {/* Header */}
      <div className="admin__hero">
        <div className="container admin__hero-inner">
          <div>
            <span className="admin__badge">⚙️ Admin Panel</span>
            <h1>Paper Box Admin</h1>
            <p>Manage schemes, users, and feedback</p>
          </div>
        </div>
      </div>

      <div className="container admin__body">
        {/* Analytics cards */}
        <div className="admin__analytics">
          {analyticsCards.map(c => (
            <div key={c.label} className={`admin__stat card admin__stat--${c.color}`}>
              <span>{c.icon}</span>
              <div>
                <div className="admin__stat-value">{c.value}</div>
                <div className="admin__stat-label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin__tabs">
          {['schemes', 'users', 'feedback'].map(t => (
            <button
              key={t}
              className={`admin__tab ${tab === t ? 'admin__tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'schemes' ? '📋' : t === 'users' ? '👥' : '💬'} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Schemes Tab ── */}
        {tab === 'schemes' && (
          <div className="admin__tab-content">
            <div className="admin__section-header">
              <h2>Government Schemes ({schemes.length})</h2>
              <button className="btn btn-primary" onClick={openNew}>+ Add Scheme</button>
            </div>

            <div className="admin__table-wrap card">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Scheme</th>
                    <th>Category</th>
                    <th>Ministry</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array(5).fill(0).map((_, i) => (
                        <tr key={i}><td colSpan={5}><div className="skeleton" style={{ height: 20, borderRadius: 4 }} /></td></tr>
                      ))
                    : schemes.map(s => {
                        const cs = getCategoryStyle(s.category);
                        return (
                          <tr key={s._id}>
                            <td className="admin__scheme-title">{s.title}</td>
                            <td>
                              <span className="badge" style={{ background: cs.bg, color: cs.text }}>
                                {categoryIcons[s.category]} {s.category}
                              </span>
                            </td>
                            <td className="admin__ministry">{s.ministry || '—'}</td>
                            <td>{s.views || 0}</td>
                            <td>
                              <div className="admin__row-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Edit</button>
                                <button className="btn btn-sm admin__del-btn" onClick={() => handleDelete(s._id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          <div className="admin__tab-content">
            <div className="admin__section-header">
              <h2>Registered Users ({users.length})</h2>
            </div>
            <div className="admin__table-wrap card">
              <table className="admin__table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>User Type</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-blue">{u.userType}</span></td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-yellow' : 'badge-gray'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Feedback Tab ── */}
        {tab === 'feedback' && (
          <div className="admin__tab-content">
            <div className="admin__section-header">
              <h2>User Feedback ({feedback.length})</h2>
            </div>
            <div className="admin__feedback-grid">
              {feedback.map(f => (
                <div key={f._id} className="admin__feedback-card card">
                  <div className="admin__feedback-header">
                    <div>
                      <strong>{f.name}</strong>
                      <div className="admin__stars">
                        {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                      </div>
                    </div>
                    <button
                      className="admin__del-btn btn btn-sm"
                      onClick={() => deleteFeedback(f._id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p>{f.message}</p>
                  <span className="admin__feedback-date">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Scheme Form Modal ── */}
      {showForm && (
        <div className="admin__modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin__modal card" onClick={e => e.stopPropagation()}>
            <div className="admin__modal-header">
              <h2>{editing ? 'Edit Scheme' : 'Add New Scheme'}</h2>
              <button onClick={() => setShowForm(false)} className="admin__modal-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="admin__form">
              <div className="admin__form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input name="title" className="form-input" value={form.title} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" className="form-input" value={form.category} onChange={handleFormChange} required>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" className="form-input" rows={3} value={form.description} onChange={handleFormChange} required />
              </div>

              <div className="form-group">
                <label>Target Users</label>
                <div className="admin__target-users">
                  {['Student', 'Farmer', 'Business Owner', 'General Citizen'].map(t => (
                    <label key={t} className={`admin__target-check ${form.targetUsers.includes(t) ? 'admin__target-check--on' : ''}`}>
                      <input
                        type="checkbox"
                        checked={form.targetUsers.includes(t)}
                        onChange={() => toggleTargetUser(t)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="admin__form-row">
                <div className="form-group">
                  <label>Eligibility</label>
                  <textarea name="eligibility" className="form-input" rows={2} value={form.eligibility} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>Benefits</label>
                  <textarea name="benefits" className="form-input" rows={2} value={form.benefits} onChange={handleFormChange} />
                </div>
              </div>

              <div className="admin__form-row">
                <div className="form-group">
                  <label>Ministry</label>
                  <input name="ministry" className="form-input" value={form.ministry} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>Official Link</label>
                  <input name="link" type="url" className="form-input" value={form.link} onChange={handleFormChange} placeholder="https://" />
                </div>
              </div>

              <div className="form-group">
                <label>Application Process</label>
                <textarea name="applicationProcess" className="form-input" rows={2} value={form.applicationProcess} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input name="tags" className="form-input" value={form.tags} onChange={handleFormChange} placeholder="farmer, loan, subsidy" />
              </div>

              <div className="admin__form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Update Scheme' : 'Create Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
