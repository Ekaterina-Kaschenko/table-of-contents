import "./styles.scss";

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <p>Loading Table of Contents...</p>
    </div>
  );
};

export default LoadingSpinner;
