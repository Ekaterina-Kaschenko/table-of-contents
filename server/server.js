const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/mockedData', async (req, res) => {
  try {
    const searchValue = (req.query.searchParams || '').toString().trim();
    const q = searchValue.toLowerCase();

    const response = await fetch('https://www.jetbrains.com/help/idea/2023.1/HelpTOC.json');
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

    const data = await response.json();

    const {
      entities: { pages },
      topLevelIds,
    } = data;

    if (!q) return res.json(data);

    // Helper: normalize title (case-insensitive; diacritics safe)
    const normalizeTitle = (s = '') =>
      s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

    const query = normalizeTitle(q);
    const keep = new Set(); // IDs to keep (matches + their parents)

    // DFS: returns true if this node or any descendant matches
    const dfs = (id) => {
      const node = pages[id];
      if (!node) return false;

      const selfMatch = normalizeTitle(node.title).includes(query);
      const children = node.pages || [];
      let childMatch = false;
      for (const childId of children) {
        if (dfs(childId)) childMatch = true;
      }

      if (selfMatch || childMatch) {
        keep.add(id);
        return true;
      }
      return false;
    };

    // Traverse from every top-level id to collect all nodes to keep
    for (const id of topLevelIds) dfs(id);

    // If nothing matched, return empty tree (or fallback to full — your choice)
    if (keep.size === 0) {
      return res.json({ entities: { pages: {} }, topLevelIds: [] });
      // or: return res.json(data); // to fallback to full TOC when no matches
    }

    // Build trimmed pages: keep only nodes in the 'keep' set
    const trimmedPages = {};
    for (const id of keep) {
      const n = pages[id];
      trimmedPages[id] = {
        ...n,
        // children list also trimmed to kept ids
        ...(n.pages ? { pages: n.pages.filter((cid) => keep.has(cid)) } : {}),
      };
    }

    const trimmedTop = topLevelIds.filter((id) => keep.has(id));

    const filtered = {
      entities: { pages: trimmedPages },
      topLevelIds: trimmedTop,
    };

    return res.json(filtered);
  } catch (err) {
    console.error('Error fetching data from JetBrains:', err?.message || err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Failed to fetch external data' });
    }
  }
});


app.get('/', (_req, res) => res.send('Mock server is running'));

app.listen(PORT, () => {
  console.log(`✅ Mock server listening on http://localhost:${PORT}`);
});
