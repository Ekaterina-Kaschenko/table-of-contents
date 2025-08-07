import { useEffect, useState } from "react";
import TreeView from "./components/TreeView";
import ErrorDisplay from "@/components/ErrorDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchTOCData, TreeViewProps } from "@/api/services/tocService";
import "./global/styles.scss";

interface AppState {
  tocData: TreeViewProps | null;
  isLoading: boolean;
  error: string | null;
}

const App = () => {
  const [state, setState] = useState<AppState>({
    tocData: null,
    isLoading: true,
    error: null,
  });

  const handleRetry = () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    loadTOCData();
  };

  const loadTOCData = async () => {
    try {
      const data = await fetchTOCData();
      console.log("TOC data loaded:", data);
      setState({
        tocData: data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error("Failed to load TOC:", err);
      setState({
        tocData: null,
        isLoading: false,
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  useEffect(() => {
    loadTOCData();
  }, []);

  if (state.isLoading) {
    return <LoadingSpinner message="Loading Table of Contents..." />;
  }

  if (state.error) {
    return (
      <ErrorDisplay
        title="Failed to Load Table of Contents"
        message={state.error}
        onRetry={handleRetry}
      />
    );
  }

  if (!state.tocData) {
    return (
      <ErrorDisplay
        title="No Data Available"
        message="Table of Contents data is not available"
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="wrapper">
      <h1>Table of Contents</h1>
      <TreeView
        entities={state.tocData.entities}
        topLevelIds={state.tocData.topLevelIds}
      />
    </div>
  );
};

export default App;
