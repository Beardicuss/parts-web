export default function LoadingSkeleton({ cards = 8 }) {
  return (
    <div className="part-grid" aria-label="Loading" aria-busy="true">
      {Array.from({ length: cards }, (_, index) => (
        <div className="part-card skeleton-card" key={index} aria-hidden="true">
          <div className="skeleton skeleton-image" />
          <div className="part-card-body">
            <div className="skeleton skeleton-line skeleton-short" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-medium" />
          </div>
        </div>
      ))}
    </div>
  );
}
