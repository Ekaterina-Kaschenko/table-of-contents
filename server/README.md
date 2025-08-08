# Mock API Server for Table of Contents Component

This is a lightweight **Express.js** server used to provide mocked API data for the **Table of Contents** component in the JetBrains test task.

---

## 🚀 Features

- **Express.js** + **CORS** support for local development.
- Endpoint `/api/mockedData` that fetches JSON data from the official JetBrains Help site and returns it to the client.
- Optional root `/` route for a quick server health check.
- Designed for **local development only** — not intended for production use.

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
