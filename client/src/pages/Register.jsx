import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Auth.css';

const USER_TYPES = ['Student', 'Farmer', 'Business Owner', 'General Citizen'];

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '', userType: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (!form.userType) return toast.error('Please select your user type');

    setLoading(true);
    try {
      const { data } = await api.post('/users/register', form);
      login(data);
      toast.success(`Welcome to PaperBox, ${data.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <h2>Your personalized<br />scheme navigator</h2>
        <p>Tell us who you are and we'll show you exactly what government benefits you're eligible for.</p>
        <div className="auth-steps">
          <div className="auth-step"><span>1</span> Create your profile</div>
          <div className="auth-step"><span>2</span> Get personalized matches</div>
          <div className="auth-step"><span>3</span> Apply with guidance</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card card">
          <div className="auth-card__header">
            <h1>Create Account</h1>
            <p>Already have one? <Link to="/login">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name" name="name" type="text"
                className="form-input" placeholder="Ramesh Kumar"
                value={form.name} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email"
                className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>

            {/* User type selection — visual cards */}
            <div className="form-group">
              <label>I am a...</label>
              <div className="user-type-grid">
                {USER_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`user-type-btn ${form.userType === type ? 'user-type-btn--active' : ''}`}
                    onClick={() => setForm(p => ({ ...p, userType: type }))}
                  >
                    <span>{type === 'Student' ? '🎓' : type === 'Farmer' ? '🌾' : type === 'Business Owner' ? '💼' : '👤'}</span>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password"
                className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword" name="confirmPassword" type="password"
                className="form-input" placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange} required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
