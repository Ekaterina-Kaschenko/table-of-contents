import React from "react";
import { render, screen } from "@testing-library/react";
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
});

describe("App", () => {
  it("shows loading spinner initially", () => {
    mockedFetch.mockReturnValue(new Promise(() => {})); // pending
    renderWithProviders(<App />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders TreeView after successful fetch", async () => {
    mockedFetch.mockResolvedValue({
      entities: { pages: {}, anchors: {} },
      topLevelIds: [],
    } as never);

    renderWithProviders(<App />);

    expect(await screen.findByTestId("treeview")).toBeInTheDocument();
    expect(screen.getByText(/Table of Contents/i)).toBeInTheDocument();
  });

  it("renders error message on fetch failure", async () => {
    mockedFetch.mockRejectedValue(new Error("Network error"));

    renderWithProviders(<App />);

    expect(await screen.findByTestId("error")).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, we couldn’t load the Table of Contents/i)
    ).toBeInTheDocument();
  });
});
