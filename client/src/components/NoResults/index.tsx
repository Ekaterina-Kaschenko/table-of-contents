// src/components/NoResults/index.tsx
import React from "react";
import "./styles.scss";

type Props = {
  visible: boolean;
  query?: string;
  onClear?: () => void;
  className?: string;
};

const NoResults: React.FC<Props> = ({ visible, query, onClear, className }) => {
  if (!visible) return null;

  return (
    <div
      className={`no-results ${className ?? ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="no-results__title">No results</div>
      {query ? (
        <div className="no-results__hint">Nothing matched “{query}”.</div>
      ) : null}
      {onClear ? (
        <button type="button" className="no-results__btn" onClick={onClear}>
          Clear search
        </button>
      ) : null}
    </div>
  );
};

export default NoResults;
