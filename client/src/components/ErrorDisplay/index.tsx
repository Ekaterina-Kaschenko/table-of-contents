import React from "react";
import "./styles.scss";

interface ErrorDisplayProps {
  title: string;
  message: string;
  onRetry?: () => void;
  showDetails?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  onRetry,
  showDetails = false,
}) => {
  const [showFullError, setShowFullError] = React.useState(false);

  const getErrorIcon = () => {
    return (
      <svg
        className="error-icon"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="#ef4444"
          fillOpacity="0.1"
          stroke="#ef4444"
          strokeWidth="2"
        />
        <path
          d="M15 9l-6 6M9 9l6 6"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const getRetryIcon = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 4v6h6M23 20v-6h-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="error-display">
      <div className="error-content">
        {getErrorIcon()}

        <div className="error-text">
          <h2 className="error-title">{title}</h2>
          <p className="error-message">{message}</p>

          {showDetails && (
            <details className="error-details">
              <summary
                className="error-details-toggle"
                onClick={() => setShowFullError(!showFullError)}
              >
                {showFullError ? "Hide" : "Show"} technical details
              </summary>
              <div className="error-details-content">
                <pre>{message}</pre>
              </div>
            </details>
          )}
        </div>

        <div className="error-actions">
          {onRetry && (
            <button
              className="retry-button"
              onClick={onRetry}
              aria-label="Retry loading"
            >
              {getRetryIcon()}
              Try Again
            </button>
          )}

          <button
            className="help-button"
            onClick={() => window.location.reload()}
            aria-label="Refresh page"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
