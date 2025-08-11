const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Mock server listening on http://localhost:${PORT}`);
});
