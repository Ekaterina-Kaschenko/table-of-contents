import React, { useState } from "react";
import "./styles.scss";

interface TopicItemProps {
  label: string;
  level?: number;
  isActive?: boolean;
  children?: React.ReactNode;
}

const TopicItem: React.FC<TopicItemProps> = ({
  label,
  level = 1,
  isActive = false,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = () => setIsExpanded((prev) => !prev);

  return (
    <div
      className={`topic-item ${isActive ? "active" : ""}`}
      style={{ "--indent": `${level * 16}px` } as React.CSSProperties}
    >
      <div
        className="topic-header"
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle();
        }}
      >
        <span className="arrow">{isExpanded ? "▾" : "▸"}</span>
        <span className="label">{label}</span>
      </div>
      {isExpanded && <div className="topic-children">{children}</div>}
    </div>
  );
};

export default TopicItem;
