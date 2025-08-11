// App.tsx
import { useEffect, useRef, useState } from "react";
import TreeView, { TreeViewHandle } from "@/components/TreeView";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchTOCData, TreeViewProps } from "@/api/services/tocService";
import ThemeControls from "@/components/ThemeControls";
import ComponentDocs from "./components/ComponentDocs";
import CustomInput from "./components/CustomInput";
import NoResults from "@/components/NoResults";
import { readQueryFromURL, setQueryInURL } from "@/api/services/urlParams";
import "./global/styles.scss";

const App = () => {
  const treeRef = useRef<TreeViewHandle>(null);

  const [tocData, setTocData] = useState<TreeViewProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);

  useEffect(() => {
    const initial = readQueryFromURL().trim();
    (async () => {
      try {
        setLoading(true);
        const data = await fetchTOCData(initial);
        setTocData(data);
        setHasSearched(!!initial);
        setLastQuery(initial);
      } catch {
        setError(
          "Sorry, we couldn’t load the Table of Contents. Please check your connection or try again later."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error} onRetry={() => location.reload()} />;

  return (
    <div className="wrapper">
      <header className="app-header">
        <h1 className="app-title">Table of Contents</h1>
        <div className="toolbar">
          <CustomInput
            placeholder="Enter topic ID"
            button="Set Active"
            syncParam={false}
            onSubmit={(id) => {
              const v = id.trim();
              if (!v) return;
              const exists = !!tocData?.entities.pages[v];
              if (!exists) {
                alert("No topic with such ID");
                return;
              }
              window.dispatchEvent(
                new CustomEvent("toc:set-active", { detail: { id: v } })
              );
            }}
          />
          <CustomInput
            key={`search-${searchResetKey}`}
            placeholder="Filter topics…"
            button="Search"
            syncParam="searchParams"
            onSubmit={async (q) => {
              const v = q.trim();
              setHasSearched(!!v);
              setLastQuery(v);
              const data = await fetchTOCData(v);
              setTocData(data);
            }}
          />

          <div className="toolbar__spacer" />
          <ThemeControls />
        </div>
      </header>

      <div className="main">
        <div className="main-wrapper">
          {tocData && tocData.topLevelIds.length > 0 ? (
            <TreeView
              ref={treeRef}
              entities={tocData.entities}
              topLevelIds={tocData.topLevelIds}
            />
          ) : (
            <NoResults
              visible={hasSearched}
              query={lastQuery}
              onClear={async () => {
                // clear URL + state + input + data
                setQueryInURL("", "replace");
                setHasSearched(false);
                setLastQuery("");
                setSearchResetKey((n) => n + 1); // remount the search input
                const data = await fetchTOCData("");
                setTocData(data);
              }}
            />
          )}
        </div>
        <ComponentDocs />
      </div>
    </div>
  );
};

export default App;
