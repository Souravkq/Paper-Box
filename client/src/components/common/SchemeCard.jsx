/**
 * SchemeCard
 * Animated card displaying a government scheme with category badge
 */
import { Link } from 'react-router-dom';
import { getCategoryStyle, categoryIcons } from '../../utils/categories';
import './SchemeCard.css';

export default function SchemeCard({ scheme, delay = 0 }) {
  const style = getCategoryStyle(scheme.category);
  const icon  = categoryIcons[scheme.category] || '📋';

  return (
    <Link
      to={`/schemes/${scheme._id}`}
      className="scheme-card card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Category indicator strip */}
      <div
        className="scheme-card__strip"
        style={{ background: style.border }}
      />

      <div className="scheme-card__body">
        {/* Header */}
        <div className="scheme-card__header">
          <span
            className="scheme-card__icon"
            style={{ background: style.bg, color: style.text }}
          >
            {icon}
          </span>
          <span
            className="badge"
            style={{ background: style.bg, color: style.text }}
          >
            {scheme.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="scheme-card__title">{scheme.title}</h3>

        {/* Description */}
        <p className="scheme-card__desc">
          {scheme.description.slice(0, 110)}...
        </p>

        {/* Footer */}
        <div className="scheme-card__footer">
          {scheme.ministry && (
            <span className="scheme-card__ministry">
              🏛️ {scheme.ministry.replace('Ministry of ', '')}
            </span>
          )}
          <span className="scheme-card__cta">
            Learn more →
          </span>
        </div>
      </div>
    </Link>
  );
}
