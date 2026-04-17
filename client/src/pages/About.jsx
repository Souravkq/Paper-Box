import { Link } from 'react-router-dom';
import './About.css';

const TEAM = [
  { name: 'Arjun Nair', role: 'Lead Developer', emoji: '👨‍💻' },
  { name: 'Priya Sharma', role: 'UX Designer', emoji: '🎨' },
  { name: 'Rohit Verma', role: 'AI Engineer', emoji: '🤖' },
];

const MILESTONES = [
  { year: '2023', event: 'Paper Box idea born at a national hackathon' },
  { year: '2024', event: 'AI integration with Gemini for smart recommendations' },
  { year: '2024', event: '500+ schemes indexed across all categories' },
  { year: '2025', event: 'Expanding to cover state-level schemes' },
];

export default function About() {
  return (
    <div className="about-page page-enter">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="section-tag">About Us</div>
          <h1>Making Government Benefits<br /><span>Accessible to Everyone</span></h1>
          <p>
            Paper Box was built with a simple belief: every Indian citizen deserves easy access
            to the benefits they're entitled to — without bureaucratic confusion.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container about-mission">
          <div className="about-mission__text">
            <div className="section-tag">Our Mission</div>
            <h2>Bridging Citizens and Opportunities</h2>
            <p>
              India has hundreds of government schemes across agriculture, education, health, housing,
              and business — but most people never find out about the benefits they qualify for.
              Paper Box changes that with AI-powered discovery and plain-language guidance.
            </p>
            <p>
              Whether you're a farmer looking for crop subsidies, a student seeking scholarships,
              or a business owner exploring MUDRA loans — Paper Box finds what's relevant to you
              and guides you through the application process.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>
              Start Exploring Free →
            </Link>
          </div>
          <div className="about-mission__visual">
            <div className="about-stat-grid">
              {[
                { value: '500+', label: 'Schemes Indexed', icon: '📋' },
                { value: '12',   label: 'Categories',      icon: '🗂️' },
                { value: '50K+', label: 'Users Helped',    icon: '👥' },
                { value: 'AI',   label: 'Powered Search',  icon: '🧠' },
              ].map(s => (
                <div key={s.label} className="about-stat card">
                  <span>{s.icon}</span>
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section about-features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Platform Features</div>
            <h2>What Makes Us Different</h2>
          </div>
          <div className="about-features">
            {[
              { icon: '🧠', title: 'Gemini AI Integration', desc: 'Our chatbot uses Google Gemini to answer your questions and suggest relevant schemes based on your profile.' },
              { icon: '🎯', title: 'Smart Personalization',  desc: 'Tell us who you are — student, farmer, business owner — and we surface the schemes most relevant to you.' },
              { icon: '🔍', title: 'Intelligent Search',     desc: 'Real-time search with autocomplete prioritizes results for your user type.' },
              { icon: '📊', title: 'Admin Analytics',        desc: 'Platform admins can track scheme usage, user engagement, and manage content easily.' },
              { icon: '💬', title: 'Community Feedback',     desc: 'Real users share their experiences and ratings to help others discover the best schemes.' },
              { icon: '📱', title: 'Mobile Responsive',      desc: 'Fully functional on any device — access your schemes from phone, tablet, or desktop.' },
            ].map((f, i) => (
              <div key={f.title} className="about-feature card" style={{ animationDelay: `${i*80}ms` }}>
                <span className="about-feature__icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Journey</div>
            <h2>Our Story</h2>
          </div>
          <div className="about-timeline">
            {MILESTONES.map((m, i) => (
              <div key={i} className="about-timeline__item">
                <div className="about-timeline__year">{m.year}</div>
                <div className="about-timeline__dot" />
                <div className="about-timeline__text card">{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section about-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to Discover Your Benefits?</h2>
          <p>Join thousands of Indians finding and applying for schemes they deserve.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
