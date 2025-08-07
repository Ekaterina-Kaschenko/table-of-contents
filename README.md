# Table of Contents Component – Test Assignment for JetBrains

This repository contains a test assignment to build a **Table of Contents** component for **JetBrains**.

The project is built with **React** and **SCSS**, and uses a **Node.js + Express** server to asynchronously fetch real JSON data from the JetBrains documentation site using the **Fetch API**. This data is served to the frontend through a local API endpoint.

I did **not** use any global state management tools such as Redux, MobX, or even the React Context API because:

- The component’s logic is localized and doesn’t require shared state across the application.
- There is no complex data flow or cross-component communication.
- Keeping the implementation simple makes the code easier to read, maintain, and evaluate.
- Since the assignment was limited in scope, additional tools would have introduced unnecessary complexity.

---

## 🛠 Tech Stack

- **Frontend**: React, SCSS
- **Backend**: Node.js, Express
- **Data Loading**: Native Fetch API (used server-side to retrieve external JSON data)

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

## Run the server

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

## Run the frontend in a new terminal

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
