import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TreeView from "@/components/TreeView";
import { mockEntities } from "@/__tests__/mockEntities";
import type { TreeViewProps } from "@/api/services/tocService";

jest.mock("@/components/TreeNodeHeader", () => {
  type PageT = import("@/api/services/tocService").Page;
  interface MockProps {
    page: PageT;
    className?: string;
    isExpanded: boolean;
    hasChildren: boolean;
    onItemClick: (page: PageT) => void;
  }

  const Mock: React.FC<MockProps> = ({
    page,
    className,
    isExpanded,
    hasChildren,
    onItemClick,
  }) => (
    <button
      data-testid={`node-${page.id}`}
      data-class={className ?? ""}
      data-expanded={isExpanded ? "true" : "false"}
      data-has-children={hasChildren ? "true" : "false"}
      onClick={() => onItemClick(page)}
    >
      {page.title}
    </button>
  );

  return { __esModule: true, default: Mock };
});

const makeProps = (): TreeViewProps => ({
  entities: {
    pages: mockEntities.pages,
  },
  topLevelIds: mockEntities.topLevelIds,
});

describe("TreeView", () => {
  test("renders top-level node", () => {
    render(<TreeView {...makeProps()} />);
    expect(screen.getByTestId("node-Getting_started")).toBeInTheDocument();
  });

  test("expands and collapses a first-level node (state-based)", async () => {
    const user = userEvent.setup();
    const { container } = render(<TreeView {...makeProps()} />);

    const root = screen.getByTestId("node-Getting_started");

    // Initially collapsed
    expect(root).toHaveAttribute("data-expanded", "false");
    const firstChildrenWrapperBefore = container.querySelector(
      ".tree-node-children"
    );
    expect(firstChildrenWrapperBefore).toHaveClass("collapsed");

    // Expand
    await user.click(root);
    expect(root).toHaveAttribute("data-expanded", "true");
    const firstChildrenWrapperAfter = container.querySelector(
      ".tree-node-children"
    );
    expect(firstChildrenWrapperAfter).toHaveClass("expanded");

    // Collapse again
    await user.click(root);
    expect(root).toHaveAttribute("data-expanded", "false");
    const firstChildrenWrapperAfterCollapse = container.querySelector(
      ".tree-node-children"
    );
    expect(firstChildrenWrapperAfterCollapse).toHaveClass("collapsed");
  });

  test("selects a leaf node without expanding", async () => {
    const user = userEvent.setup();
    render(<TreeView {...makeProps()} />);

    // Expand Getting_started -> First_steps
    await user.click(screen.getByTestId("node-Getting_started"));
    await user.click(screen.getByTestId("node-First_steps"));

    const leaf = screen.getByTestId("node-Installation");
    await user.click(leaf);

    expect(leaf).toHaveAttribute("data-class", "selected");
    expect(leaf).toHaveAttribute("data-expanded", "false"); // leaf does not expand
  });

  test("highlights all ancestors when a deep child is active", async () => {
    const user = userEvent.setup();
    render(<TreeView {...makeProps()} />);

    // Expand path: Getting_started -> First_steps, then select Hello_World
    await user.click(screen.getByTestId("node-Getting_started"));
    await user.click(screen.getByTestId("node-First_steps"));
    await user.click(screen.getByTestId("node-Hello_World"));

    expect(screen.getByTestId("node-Hello_World")).toHaveAttribute(
      "data-class",
      "selected"
    );
    expect(screen.getByTestId("node-First_steps")).toHaveAttribute(
      "data-class",
      "highlighted"
    );
    expect(screen.getByTestId("node-Getting_started")).toHaveAttribute(
      "data-class",
      "highlighted"
    );
  });

  test("expands a different branch and selects a leaf", async () => {
    const user = userEvent.setup();
    render(<TreeView {...makeProps()} />);

    await user.click(screen.getByTestId("node-Getting_started"));
    await user.click(screen.getByTestId("node-Customization"));

    const themes = screen.getByTestId("node-Themes");
    await user.click(themes);

    expect(themes).toHaveAttribute("data-class", "selected");
  });
});
