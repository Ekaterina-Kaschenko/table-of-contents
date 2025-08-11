import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import App from "../App";
import { fetchTOCData } from "@/api/services/tocService";
import { ThemeProvider } from "@/theme/ThemeProvider";

jest.mock("@/api/services/tocService", () => ({
  __esModule: true,
  fetchTOCData: jest.fn(),
}));

jest.mock("@/components/TreeView", () => ({
  __esModule: true,
  default: () => <div data-testid="treeview" />,
}));

jest.mock("@/components/ErrorMessage", () => ({
  __esModule: true,
  default: ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div data-testid="error">
      <p>{message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock("@/components/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="spinner">Loading...</div>,
}));

const mockedFetch = fetchTOCData as jest.MockedFunction<typeof fetchTOCData>;

const renderWithProviders = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

// reliable helper to set URL before render
const setUrl = (path: string) => {
  const url = new URL(path, "http://localhost");
  window.history.pushState({}, "", url);
};

beforeEach(() => {
  jest.resetAllMocks();

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      matches: false,
      media: "(prefers-color-scheme: dark)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });

  document.documentElement.removeAttribute("data-theme");
  localStorage.clear();
  // reset URL each test
  setUrl("/");
});

describe("App", () => {
  it("shows loading spinner initially", () => {
    mockedFetch.mockReturnValue(new Promise(() => {})); // pending
    renderWithProviders(<App />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders TreeView after successful fetch with data", async () => {
    mockedFetch.mockResolvedValue({
      entities: { pages: { A: { id: "A", title: "A" } }, anchors: {} },
      topLevelIds: ["A"],
    } as never);

    renderWithProviders(<App />);

    // treeview appears once data is in
    expect(await screen.findByTestId("treeview")).toBeInTheDocument();
    expect(document.querySelector(".app-title")).toHaveTextContent(
      /table of contents/i
    );
  });

  it("renders error message on fetch failure", async () => {
    mockedFetch.mockRejectedValue(new Error("Network error"));

    renderWithProviders(<App />);

    expect(await screen.findByTestId("error")).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, we couldn’t load the Table of Contents/i)
    ).toBeInTheDocument();
  });

  it("renders NoResults when URL has ?searchParams and backend returns empty", async () => {
    // 1) URL contains a non-empty query BEFORE render
    setUrl("/?searchParams=foo");

    // 2) backend returns empty tree
    mockedFetch.mockResolvedValue({
      entities: { pages: {}, anchors: {} },
      topLevelIds: [],
    } as never);

    renderWithProviders(<App />);

    await waitFor(() =>
      expect(document.querySelector(".no-results")).toBeTruthy()
    );
    const pane = document.querySelector(".no-results") as HTMLElement;
    expect(pane.querySelector(".no-results__title")!).toHaveTextContent(
      /no results/i
    );
    expect(pane.querySelector(".no-results__hint")!).toHaveTextContent(/foo/i);
  });
});
