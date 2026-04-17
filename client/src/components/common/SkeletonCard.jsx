import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card card">
      <div className="skeleton skeleton-strip" />
      <div className="skeleton-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton skeleton-icon" />
          <div className="skeleton skeleton-badge" />
        </div>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-line--short" />
        <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 12, marginTop: 4 }}>
          <div className="skeleton skeleton-line skeleton-line--xs" />
        </div>
      </div>
    </div>
  );
}
