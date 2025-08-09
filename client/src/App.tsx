import { useEffect, useState } from "react";
import TreeView from "@/components/TreeView";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchTOCData, TreeViewProps } from "@/api/services/tocService";
import ThemeControls from "@/components/ThemeControls";
import SearchBar from "@/components/SearchBar";
import ComponentDocs from "./components/ComponentDocs";
import "./global/styles.scss";

const App = () => {
  const [tocData, setTocData] = useState<TreeViewProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTOCData()
      .then((data) => setTocData(data))
      .catch(() =>
        setError(
          "Sorry, we couldn’t load the Table of Contents. Please check your connection or try again later."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error} onRetry={() => location.reload()} />;

  return (
    <div className="wrapper">
      <header className="app-header">
        <h1 className="app-title">Table of Contents</h1>
        <div className="toolbar">
          <SearchBar
            endpoint="/api/mockedData"
            placeholder="Filter topics…"
            onResults={(data) => setTocData(data)}
          />
          <ThemeControls />
        </div>
      </header>

      <div className="content-grid">
        <TreeView
          entities={tocData!.entities}
          topLevelIds={tocData!.topLevelIds}
        />
        <ComponentDocs />
      </div>
    </div>
  );
};

export default App;
