# Mock API Server for Table of Contents Component

This is a lightweight **Express.js** server used to provide mocked API data for the **Table of Contents** component in the JetBrains test task.

It acts as a bridge between the frontend and the original JetBrains documentation data, fetching the JSON, processing it, and returning the final result to the client.

---

## 🚀 Features

- **Express.js** + **CORS** support for local development.
- **Dynamic TOC Data Fetching** – Retrieves JSON data directly from the official JetBrains Help site.
- **Server-Side Search with DFS** – When a `searchParams` query is provided, the server filters the tree using a **Depth-First Search algorithm**, returning only matching nodes (plus their parent nodes for context).
- **Endpoint `/api/mockedData`** – Returns either the full table of contents or a filtered version based on the search query.
- **Persistent Search Parameters** – Matches frontend behavior so that shared URLs or page reloads return the correct filtered data.

---

## 📦 Tech Stack

- **Node.js**
- **Express.js**
- **CORS**
- Native **fetch** API

---

## 🛠 Installation & Setup

1. **Navigate to the server directory**

```bash
cd server
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the server**

```bash
node server.js
```

The server will be available at:

```bash
http://localhost:3001
```

## 📡 API Endpoints

### `GET /api/mockedData`

Fetches the table of contents data.

**Query Parameters:**

- `searchParams` _(optional)_ – Search term used to filter the TOC on the server.
