import { useEffect, useState } from "react";
import TableOfContents from "./components/TableOfContents";
import { fetchTOCData, TOCData } from "./api/services/tocService";

function App() {
  const [tocData, setTocData] = useState<TOCData | null>(null);

  useEffect(() => {
    fetchTOCData()
      .then((data) => {
        console.log("TOC data loaded:", data);
        setTocData(data);
      })
      .catch((err) => console.error("Failed to load TOC:", err));
  }, []);

  if (!tocData) return <div>Loading Table of Contents...</div>;

  console.log("tocData.entities", tocData.entities);
  console.log("tocData.topLevelIds", tocData.topLevelIds);

  return (
    <div style={{ padding: 20 }}>
      <h1>Table of Contents</h1>
      <TableOfContents
        entities={tocData.entities}
        topLevelIds={tocData.topLevelIds}
      />
    </div>
  );
}

export default App;
