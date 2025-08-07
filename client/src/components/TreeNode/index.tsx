import React from "react";

interface TreeNodeProps {
  label: string;
  icon?: React.ReactNode;
  hasChildren?: boolean;
  isExpanded?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  label,
  icon,
  hasChildren = false,
  isExpanded = false,
}) => {
  const arrowIcon = hasChildren ? (
    <span className={`arrow-icon ${isExpanded ? "expanded" : ""}`}>▼</span>
  ) : null;

  const displayIcon = icon || arrowIcon;

  return (
    <>
      {displayIcon && <span className="arrow">{displayIcon}</span>}
      <span className="label">{label}</span>
    </>
  );
};

export default TreeNode;
