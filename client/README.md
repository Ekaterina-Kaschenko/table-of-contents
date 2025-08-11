# Table of Contents Component (JetBrains Test Task)

This project contains the **client-side implementation** of a **Table of Contents** component, built as part of a test task for JetBrains.  
The component is designed for flexibility, performance, and maintainability, following modern React development best practices.

---

## 🚀 Features

- **Dynamic Table of Contents rendering** based on structured data (`pages`, `anchors`, `topLevelIds`).
- **Expandable / collapsible topics** with smooth recursive rendering.
- **Highlighting rules** based on nesting level
  - First level always highlighted
  - Current topic highlighted in blue
- **Anchor display** only after the related page is activated.
- **Search functionality** with server-side filtering using DFS algorithm.
- **Deep linking** — search parameters are stored in the URL so results persist on reload or when sharing the link.
- **Set active topic by ID** with auto-scrolling and highlighting.
- **No Results state** with a friendly UI when no matches are found.
- **Theme switching** between light, dark, and system modes.
- **Performance-optimized** — removed unnecessary `useCallback` and `useMemo` usage to take full advantage of the new React Compiler in the TreeView component.
- Integrated with **ESLint** (including `eslint-plugin-react-hooks@rc`) for compiler-aware linting.

---

## 📦 Tech Stack

- **React** (with new compiler optimizations)
- **TypeScript**
- **Jest** + **React Testing Library** for unit tests
- **ESLint** for linting and code quality
- **Vite** for fast development build

---

## 🛠 Installation & Setup

1. **Install dependencies**

```bash
npm install
```

2. **Run the development server**

```bash
npm run dev
```

3. **Running Tests**

```bash
npm test
```
