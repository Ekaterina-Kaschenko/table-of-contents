import React from "react";
import TreeNode from "../TreeNode";

interface Page {
  id: string;
  title: string;
  url?: string;
  level: number;
  parentId?: string;
  pages?: string[];
  tabIndex?: number;
}

interface TreeNodeHeaderProps {
  page: Page;
  className: string;
  isExpanded: boolean;
  hasChildren: boolean;
  onItemClick: (page: Page) => void;
}

const TreeNodeHeader: React.FC<TreeNodeHeaderProps> = ({
  page,
  className,
  isExpanded,
  hasChildren,
  onItemClick,
}) => {
  const handleClick = () => {
    onItemClick(page);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onItemClick(page);
    }
  };

  return (
    <div
      className={`tree-node-header ${className}`}
      style={{ paddingLeft: `${20 + page.level * 32}px` }}
      tabIndex={0}
      role="button"
      aria-expanded={hasChildren ? isExpanded : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <TreeNode
        label={page.title}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default TreeNodeHeader;
