# Proposal: Backend Filtering and Lazy Loading for Table of Contents

## Context

Currently, the backend always returns the **full Table of Contents (TOC)** tree, even when only a small part of it is displayed on screen.  
This approach works for small datasets but becomes impractical for large documentation sets with potentially **thousands of items**.

## Problem

- **Large Payloads** – Returning the entire tree for every request produces large JSON responses, which take longer to transmit and parse.
- **Unnecessary Data Transfer** – Most of the returned data may never be viewed by the user.
- **Scalability Limits** – As the TOC grows, performance and load times will degrade.

## Proposed Improvements

### 1. Backend Filtering and Lazy Loading of Subpages

The backend already performs DFS-based filtering to return only matching nodes and their ancestors.  
The improvement would be to **extend this with lazy-loading of children** so the server sends only the nodes currently visible to the user, without including all their descendants by default.

**How it would work:**

- The initial request returns only **top-level nodes** (and possibly their immediate children if expanded by default).
- Each node includes:
  - `childCount` OR `hasChildren` flag
- When the user expands a node, the frontend sends a request:

```bash
GET /api/mockedData?parentId=<nodeId>
```

to fetch only that node’s direct children.

- `parentId=0` or no `parentId` → returns **top-level nodes**.
- Any other `parentId` → returns **only that node’s children**.

**Caching Optimization:**
If the server supports the `Last-Modified` header (or ETag), browsers can cache subpage responses. This means subsequent requests for already-loaded nodes can be served instantly from the browser cache without hitting the server.

### 2. Stable Identifiers

Switch from text-based identifiers to **stable numeric IDs**. (now some id's are `Big_Data_Tools_Spark`)

**Benefits:**

- Smaller payloads (numeric IDs are more compact).
- Renaming a page won’t break links or cause mismatches.
- While string repetition compresses well with gzip, numeric IDs improve **consistency** and **simplify referencing**.
