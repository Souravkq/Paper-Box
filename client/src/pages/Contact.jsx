/**
 * Contact Page
 * Contact info + star-rating feedback form + dynamic reviews
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Contact.css';

export default function Contact() {
  const { user }              = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '', rating: 0, message: '' });
  const [hover, setHover]     = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  useEffect(() => {
    api.get('/feedback').then(r => setFeedback(r.data)).catch(() => {});
  }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.rating) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      const { data } = await api.post('/feedback', { ...form, userId: user?._id });
      setFeedback(prev => [data, ...prev]);
      setSubmitted(true);
      toast.success('Thank you for your feedback! 🎉');
      setForm({ name: '', email: '', rating: 0, message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : '—';

  return (
    <div className="contact-page page-enter">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <div className="section-tag">Contact</div>
          <h1>We'd Love to Hear From You</h1>
          <p>Send us your feedback, questions, or suggestions.</p>
        </div>
      </section>

      <div className="container contact-body">
        {/* Info cards */}
        <div className="contact-info">
          {[
            { icon: '📧', label: 'Email',    value: 'support@paperbox.in' },
            { icon: '📞', label: 'Phone',    value: '+91 98765 43210' },
            { icon: '📍', label: 'Location', value: 'New Delhi, India 🇮🇳' },
            { icon: '⏰', label: 'Support',  value: 'Mon–Sat, 9am–6pm' },
          ].map(c => (
            <div key={c.label} className="contact-info-card card">
              <span className="contact-info-card__icon">{c.icon}</span>
              <div>
                <div className="contact-info-card__label">{c.label}</div>
                <div className="contact-info-card__value">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-main">
          {/* Feedback form */}
          <div className="contact-form-wrap card">
            <h2>Share Your Experience</h2>
            <p>Rate Paper Box and help us improve</p>

            {submitted ? (
              <div className="contact-success">
                <span>🎉</span>
                <h3>Thank you for your feedback!</h3>
                <p>Your review has been published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      name="name" className="form-input"
                      value={form.name} onChange={handleChange}
                      placeholder="Ramesh Kumar" required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email (optional)</label>
                    <input
                      name="email" type="email" className="form-input"
                      value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Star rating */}
                <div className="form-group">
                  <label>Your Rating *</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= (hover || form.rating) ? 'star-btn--active' : ''}`}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setForm(p => ({ ...p, rating: star }))}
                        aria-label={`Rate ${star} stars`}
                      >
                        ★
                      </button>
                    ))}
                    {form.rating > 0 && (
                      <span className="star-label">
                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][form.rating]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea
                    name="message" className="form-input"
                    value={form.message} onChange={handleChange}
                    rows={4}
                    placeholder="Share your experience with Paper Box..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback →'}
                </button>
              </form>
            )}
          </div>

          {/* Reviews */}
          <div className="contact-reviews">
            <div className="contact-reviews__header">
              <div>
                <h2>User Reviews</h2>
                <p>{feedback.length} reviews · ⭐ {avgRating} average</p>
              </div>
            </div>

            <div className="reviews-grid">
              {feedback.map((f, i) => (
                <div
                  key={f._id}
                  className="review-card card"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="review-card__header">
                    <div className="review-card__avatar">
                      {f.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="review-card__name">{f.name}</div>
                      <div className="review-card__stars">
                        {'★'.repeat(f.rating)}<span>{'★'.repeat(5 - f.rating)}</span>
                      </div>
                    </div>
                    <div className="review-card__date">
                      {new Date(f.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <p className="review-card__msg">{f.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
