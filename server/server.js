const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());


// Endpoint to fetch TOC mock
app.get('/api/mockedData', async (req, res) => {
  try {
    const response = await fetch('https://www.jetbrains.com/help/idea/2023.1/HelpTOC.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data from JetBrains:', err.message);
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});

// Optional: health check
app.get('/', (req, res) => {
  res.send('Mock server is running');
});

app.listen(PORT, () => {
  console.log(`✅ Mock server listening on http://localhost:${PORT}`);
});
