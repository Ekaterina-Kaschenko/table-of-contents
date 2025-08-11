# Table of Contents Component – Test Assignment for JetBrains

This repository contains a test assignment to build a **Table of Contents** component for **JetBrains**.

The project is built with **React** and **SCSS**, and uses a **Node.js + Express** server to asynchronously fetch real JSON data from the JetBrains documentation site using the **Fetch API**. This data is served to the frontend through a local API endpoint.

### ✅ Summary of Completed Work

- **Core Table of Contents Component** – Fully functional and styled according to the provided design.
- **Recursive Tree Rendering** – The tree is built recursively: starting from `topLevelIds`, rendering each page, and, if it has children, rendering them by calling the same logic again.
- **Expand/Collapse Nodes** – Users can expand and collapse tree nodes to navigate easily.
- **Backend Integration (Express)** – Implemented an API endpoint that serves real JSON data fetched from JetBrains documentation.
- **Server-Side Search with DFS Filtering** – Search requests are handled on the server using a Depth-First Search algorithm, ensuring only matching nodes and their parents are returned.
- **Search URL Persistence** – Search parameters are saved to the URL, allowing direct link sharing and automatic restoration of results on page reload.
- **Set Active Topic by ID** – Users can enter a topic ID to automatically scroll to and highlight it. If no topic matches, a friendly “No results” message appears.
- **No Results Pane** – Clear visual feedback when no search results or no matching topic IDs are found.
- **Smooth Scrolling & Highlighting** – The active topic is highlighted and smoothly scrolled into view.
- **Light/Dark/System Theme Switching** – Supports theme switching via a toolbar toggle. System mode adapts to the user’s OS preference.
- **Unit Testing** – Added tests to verify key parts of the functionality and ensure stability.

---

## 🛠 Tech Stack

- **Frontend**: React (with new `React Compiler` in the `TreeView` component), SCSS
- **Theme Management**: React Context API (used for light/dark/system theme switching)
- **Backend**: Node.js, Express
- **Data Loading**: Native Fetch API (used server-side to retrieve external JSON data)
- **Testing**: React Testing Library + Vitest

---

## 📁 Project Structure

The repository consists of two main folders:

- **`client/`** – Frontend application built with React and SCSS.
- **`server/`** – Backend server using Node.js and Express.

---

## 🚀 Getting Started

To run the project locally:

### 1. Clone the repository

```bash
git clone git@github.com:Ekaterina-Kaschenko/table-of-contents.git
```

## 📡📡 Run the server

### 2. Go to `table-of-contents` folder

```bash
cd table-of-contents
```

### 3. Go to `server` folder

```bash
cd server
```

### 4. Install the dependencies

```bash
npm install
```

### 5. Run the server

```bash
node server.js
```

## 🎨🎨 Run the frontend in a new terminal

### 6. Go to `client` folder

```bash
cd client
```

### 7. Install the dependencies

```bash
npm install
```

### 8. Start the frontend

```bash
npm run build
```

### 9. View the app in your browser

Once the frontend is built and the server is running, open your browser and go to:

```bash
http://localhost:5173
```
