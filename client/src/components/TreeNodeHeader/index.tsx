import React from "react";
import TreeNode from "../TreeNode";
import { Page } from "@/api/services/tocService";
import "./styles.scss";

interface TreeNodeHeaderProps {
  page: Page;
  className: string;
  isExpanded: boolean;
  hasChildren: boolean;
  onItemClick: (page: Page) => void;
  nodeRef?: (el: HTMLDivElement | null) => void; // ← NEW
}

const TreeNodeHeader: React.FC<TreeNodeHeaderProps> = ({
  page,
  className,
  isExpanded,
  hasChildren,
  onItemClick,
  nodeRef,
}) => {
  const handleClick = () => onItemClick(page);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onItemClick(page);
    }
  };

  return (
    <div
      ref={nodeRef}
      data-id={page.id}
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
