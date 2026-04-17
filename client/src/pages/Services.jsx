import { Link } from 'react-router-dom';
import './Services.css';

const SERVICES = [
  {
    icon: '🔍',
    title: 'Subsidy Discovery',
    desc: 'Browse and filter 500+ government schemes across 12 categories. Our smart search prioritizes results based on your profile.',
    features: ['Category filters', 'Real-time search', 'User-type priority'],
    color: '#dbeafe',
    accent: '#1a56db',
  },
  {
    icon: '🤖',
    title: 'AI Chatbot (Gemini)',
    desc: 'Ask PaperBox AI anything about government benefits. Get instant, personalized answers powered by Google Gemini.',
    features: ['Natural language Q&A', 'Context-aware answers', 'Scheme suggestions'],
    color: '#ede9fe',
    accent: '#5b21b6',
  },
  {
    icon: '🎯',
    title: 'Smart Recommendations',
    desc: 'Get schemes tailored to your specific profile — student, farmer, business owner, or general citizen.',
    features: ['Profile-based matching', 'Search history learning', 'View tracking'],
    color: '#d1fae5',
    accent: '#065f46',
  },
  {
    icon: '🔔',
    title: 'Scheme Guidance',
    desc: 'Each scheme includes eligibility criteria, benefits, application steps, and direct links to official portals.',
    features: ['Step-by-step guidance', 'Official links', 'Eligibility checks'],
    color: '#fef3c7',
    accent: '#92400e',
  },
  {
    icon: '⚙️',
    title: 'Admin Management',
    desc: 'A dedicated admin panel for managing scheme listings, monitoring user feedback, and viewing analytics.',
    features: ['Add/Edit/Delete schemes', 'User management', 'Feedback moderation'],
    color: '#fce7f3',
    accent: '#9d174d',
  },
  {
    icon: '💬',
    title: 'Community Reviews',
    desc: 'Real feedback from real users who have applied for and benefited from government schemes.',
    features: ['Star ratings', 'Experience sharing', 'Verified reviews'],
    color: '#e0f2fe',
    accent: '#0369a1',
  },
];

export default function Services() {
  return (
    <div className="services-page page-enter">
      {/* Hero */}
      <section className="services-hero">
        <div className="container">
          <div className="section-tag">Our Services</div>
          <h1>Everything You Need to<br />Access Government Benefits</h1>
          <p>From discovery to application — Paper Box supports you at every step.</p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section">
        <div className="container">
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="service-card card fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="service-card__icon-wrap"
                  style={{ background: s.color }}
                >
                  <span>{s.icon}</span>
                </div>
                <h3 style={{ color: s.accent }}>{s.title}</h3>
                <p>{s.desc}</p>
                <ul className="service-card__features">
                  {s.features.map(f => (
                    <li key={f}>
                      <span style={{ color: s.accent }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section services-how">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Process</div>
            <h2>How Paper Box Works</h2>
            <p>Get started in three simple steps</p>
          </div>
          <div className="services-steps">
            {[
              { step: '01', icon: '👤', title: 'Create Your Profile', desc: 'Register with your name, email, and user type (Student, Farmer, Business Owner, or Citizen).' },
              { step: '02', icon: '🔍', title: 'Discover Schemes',    desc: 'Browse recommended schemes or use smart search to find exactly what you need.' },
              { step: '03', icon: '📝', title: 'Apply with Guidance', desc: 'Follow step-by-step guidance, visit official portals, and apply for your benefits.' },
            ].map((s, i) => (
              <div key={s.step} className="services-step card">
                <div className="services-step__number">{s.step}</div>
                <span className="services-step__icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section services-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Start Using Paper Box Today</h2>
          <p>Free, fast, and built for every Indian citizen.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/schemes"  className="btn btn-outline btn-lg">Browse Schemes</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
