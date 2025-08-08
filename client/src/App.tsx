import { useEffect, useState } from "react";
import TreeView from "@/components/TreeView";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchTOCData, TreeViewProps } from "@/api/services/tocService";
import ThemeControls from "@/components/ThemeControls";
import "./global/styles.scss";

const App = () => {
  const [tocData, setTocData] = useState<TreeViewProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = () => {
    setLoading(true);
    setError(null);

    fetchTOCData()
      .then((data) => setTocData(data))
      .catch(() =>
        setError(
          "Sorry, we couldn’t load the Table of Contents. Please check your connection or try again later."
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="wrapper">
      <header className="app-header">
        <h1>Table of Contents</h1>
        <ThemeControls />
      </header>

      <TreeView
        entities={tocData!.entities}
        topLevelIds={tocData!.topLevelIds}
      />
    </div>
  );
};

export default App;
