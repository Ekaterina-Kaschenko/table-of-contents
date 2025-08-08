import { render, screen } from "@testing-library/react";
import App from "../App";
import { fetchTOCData } from "@/api/services/tocService";

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

describe("App", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("shows loading spinner initially", () => {
    mockedFetch.mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders TreeView after successful fetch", async () => {
    mockedFetch.mockResolvedValue({
      entities: { pages: {}, anchors: {}, topLevelIds: [] },
      topLevelIds: [],
    } as never);

    render(<App />);

    expect(await screen.findByTestId("treeview")).toBeInTheDocument();
    expect(screen.getByText(/Table of Contents/i)).toBeInTheDocument();
  });

  it("renders error message on fetch failure", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedFetch.mockRejectedValue(new Error("Network error"));

    render(<App />);

    expect(await screen.findByTestId("error")).toBeInTheDocument();
    expect(errSpy).toHaveBeenCalledWith(
      "Failed to load TOC:",
      expect.any(Error)
    );
    errSpy.mockRestore();
  });
});
