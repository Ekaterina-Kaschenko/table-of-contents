import "./styles.scss";

const ComponentDocs = () => {
  return (
    <aside className="docs">
      <div className="card">
        {/* <h2 className="card__title">Table of Contents — Demo</h2> */}
        <p className="card__text">
          This is a small demo of a <strong>Table of Contents</strong> component
          built with React. It renders a nested tree, supports light/dark
          themes, and talks to a tiny Express backend.
        </p>
      </div>

      <div className="card">
        <h3 className="card__title">What’s inside</h3>
        <ul className="list">
          <li>
            <strong>Tree rendering:</strong> we get a normalized structure
            <code>{` { entities: { pages }, topLevelIds } `}</code> and build
            the tree recursively from <code>topLevelIds</code> down through
            child ids.
          </li>
          <li>
            <strong>Selection:</strong> clicking a row selects it; clicking
            again toggles expand/collapse. Parents of the selected item are
            highlighted.
          </li>
          <li>
            <strong>Themes:</strong> light / dark / system via the switcher in
            the toolbar.
          </li>
        </ul>
      </div>

      <div className="card">
        <h3 className="card__subtitle">Backend (Express)</h3>
        <ul className="list">
          <li>
            Endpoint: <code>GET /api/mockedData</code>. Optional query:
            <code> ?searchParams=&lt;query&gt;</code>.
          </li>
          <li>
            For now, the server logs the query and returns the full TOC (no
            filtering yet). Next step: filter on the server and return a trimmed
            tree.
          </li>
        </ul>
      </div>

      <div className="card">
        <h3 className="card__subtitle">How to use (search)</h3>
        <ol className="list">
          <li>
            Type your text in the input and click <em>Search</em>.
          </li>
          <li>
            The app writes <code>?searchParams=&lt;query&gt;</code> to the URL.
          </li>
          <li>
            The frontend calls <code>/api/mockedData?searchParams=…</code>.
          </li>
          <li>
            The response replaces the current data and the tree re-renders.
          </li>
          <li>
            Click <em>Clear</em> to remove the param and load the full TOC
            again.
          </li>
        </ol>
      </div>
    </aside>
  );
};

export default ComponentDocs;
