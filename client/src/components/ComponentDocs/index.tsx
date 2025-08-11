import "./styles.scss";

const ComponentDocs = () => {
  return (
    <aside className="docs">
      <div className="card">
        <h3 className="card__title">Hi folks!</h3>
        <p className="card__text">
          This is a short overview of the <strong>Table of Contents</strong>{" "}
          component I built for this test task. It renders a nested tree from
          server data, supports light/dark/system themes, searching, selecting
          by topic ID, and smooth scrolling to the active item.
        </p>
      </div>

      <div className="card">
        <h3 className="card__title">How the tree is built</h3>
        <ul className="list">
          <li>
            The server returns a normalized shape:{" "}
            <code>{`{ entities: { pages }, topLevelIds }`}</code>.
          </li>
          <li>
            The <code>TreeView</code> component renders{" "}
            <strong>recursively</strong>: start at <code>topLevelIds</code>,
            render each page, and if it has children, render them by calling the
            same function again.
          </li>
          <li>
            Rows can be expanded/collapsed, and selected rows highlight their
            ancestors for context.
          </li>
        </ul>
      </div>

      <div className="card">
        <h3 className="card__subtitle">Backend (Express)</h3>
        <ul className="list">
          <li>
            Small Express server that proxies JetBrains JSON and optionally
            filters it.
          </li>
          <li>
            Endpoint:{" "}
            <code>GET /api/mockedData?searchParams=&lt;query&gt;</code>
          </li>
          <li>
            Filtering is done server-side with a <strong>DFS algorithm</strong>,
            so only matching nodes and their parents are returned.
          </li>
        </ul>
      </div>

      <div className="card">
        <h3 className="card__subtitle">Search</h3>
        <ol className="list">
          <li>
            Type a keyword (e.g. <code>React</code>) and click <em>Search</em>.
          </li>
          <li>
            The app writes <code>?searchParams=&lt;query&gt;</code> to the URL.
          </li>
          <li>The backend filters and returns the matching set.</li>
          <li>The tree updates with only the results that match.</li>
          <li>
            If there are no matches, a friendly <strong>“No results”</strong>{" "}
            pane appears with a clear button.
          </li>
        </ol>
      </div>

      <div className="card">
        <h3 className="card__subtitle">Set active by ID</h3>
        <ul className="list">
          <li>Enter a page ID and click “Set Active”.</li>
          <li>
            The tree expands the node’s parents, highlights it in blue, and
            scrolls it into view.
          </li>
          <li>If no topic matches that ID, a clear message is shown.</li>
        </ul>
      </div>

      <div className="card">
        <h3 className="card__subtitle">Themes</h3>
        <ul className="list">
          <li>Switch between Light, Dark, or System mode.</li>
          <li>System mode adapts to your OS preference automatically.</li>
        </ul>
      </div>
    </aside>
  );
};

export default ComponentDocs;
