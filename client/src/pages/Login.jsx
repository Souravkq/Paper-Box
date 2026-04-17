import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 👋`);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span>📦</span>
          <span>Paper<b>Box</b></span>
        </div>
        <h2>Welcome back to<br />your benefits hub</h2>
        <p>Access thousands of government schemes personalized for you — all in one place.</p>
        <div className="auth-badges">
          <span>🌾 Agricultural Subsidies</span>
          <span>🎓 Education Scholarships</span>
          <span>💼 Business Loans</span>
          <span>🏠 Housing Benefits</span>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card card">
          <div className="auth-card__header">
            <h1>Sign In</h1>
            <p>Don't have an account? <Link to="/register">Create one free</Link></p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-demo">
            <p>Demo accounts:</p>
            <code onClick={() => setForm({ email: 'admin@paperbox.com', password: 'admin123' })}>
              admin@paperbox.com / admin123
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
