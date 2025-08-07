import React, { useState, JSX } from "react";
import TreeNodeHeader from "../TreeNodeHeader";
import "./styles.scss";

interface Page {
  id: string;
  title: string;
  url?: string;
  level: number;
  parentId?: string;
  pages?: string[];
  tabIndex?: number;
}

interface TreeViewProps {
  entities: {
    pages: Record<string, Page>;
  };
  topLevelIds: string[];
}

const TreeView: React.FC<TreeViewProps> = ({ entities, topLevelIds }) => {
  const { pages } = entities;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // note: removed all useCallback and UseMemo because of using new react-compiler
  const toggleExpand = (id: string): void => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isInActivePath = (pageId: string): boolean => {
    if (!activeId || pageId === activeId) return pageId === activeId;

    let current = pages[activeId];
    while (current?.parentId) {
      if (current.parentId === pageId) return true;
      current = pages[current.parentId];
    }
    return false;
  };

  const getItemClassName = (page: Page): string => {
    const isActive = activeId === page.id;
    const inActivePath = isInActivePath(page.id);

    if (isActive) return "selected";
    if (inActivePath) return "highlighted";
    return "";
  };

  const handleItemClick = (page: Page): void => {
    setActiveId(page.id);
    if (page.pages?.length) {
      toggleExpand(page.id);
    }
  };

  const buildTree = (ids: string[]): JSX.Element[] => {
    return ids
      .map((id) => {
        const page = pages[id];
        if (!page) return null;

        const isExpanded = expandedIds.has(page.id);
        const hasChildren = Boolean(page.pages?.length);

        return (
          <div
            key={page.id}
            className={`tree-node-wrapper ${isExpanded ? "highlighted" : ""}`}
          >
            <TreeNodeHeader
              page={page}
              className={getItemClassName(page)}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              onItemClick={handleItemClick}
            />

            {hasChildren && page.pages && (
              <div
                className={`tree-node-children ${
                  isExpanded ? "expanded" : "collapsed"
                }`}
              >
                {buildTree(page.pages)}
              </div>
            )}
          </div>
        );
      })
      .filter((item): item is JSX.Element => item !== null);
  };

  return <div className="tree-view-container">{buildTree(topLevelIds)}</div>;
};

export default TreeView;
