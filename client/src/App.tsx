import { useEffect, useState } from "react";
import TreeView from "./components/TreeView";
import { fetchTOCData, TreeViewProps } from "./api/services/tocService";
import "./global/styles.scss";

const App = () => {
  const [tocData, setTocData] = useState<TreeViewProps | null>(null);

  useEffect(() => {
    fetchTOCData()
      .then((data) => {
        console.log("TOC data loaded:", data);
        setTocData(data);
      })
      .catch((err) => console.error("Failed to load TOC:", err));
  }, []);

  if (!tocData) return <div>Loading Table of Contents...</div>;

  return (
    <div className="wrapper">
      <h1>Table of Contents</h1>
      <TreeView entities={tocData.entities} topLevelIds={tocData.topLevelIds} />
    </div>
  );
};

export default App;
