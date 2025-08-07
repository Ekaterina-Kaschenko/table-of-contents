import React, { useState, useCallback, JSX } from "react";
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

  const toggleExpand = useCallback((id: string): void => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isInActivePath = useCallback(
    (pageId: string): boolean => {
      if (!activeId || pageId === activeId) return pageId === activeId;

      let current = pages[activeId];
      while (current?.parentId) {
        if (current.parentId === pageId) return true;
        current = pages[current.parentId];
      }
      return false;
    },
    [activeId, pages]
  );

  const getItemClassName = useCallback(
    (page: Page): string => {
      const isActive = activeId === page.id;
      const inActivePath = isInActivePath(page.id);

      if (isActive) return "selected";
      if (inActivePath) return "highlighted";
      return "";
    },
    [activeId, isInActivePath]
  );

  const handleItemClick = useCallback(
    (page: Page): void => {
      setActiveId(page.id);
      if (page.pages?.length) {
        toggleExpand(page.id);
      }
    },
    [toggleExpand]
  );

  const buildTree = useCallback(
    (ids: string[]): JSX.Element[] => {
      return ids
        .map((id) => {
          const page = pages[id];
          if (!page) return null;

          const isExpanded = expandedIds.has(page.id);
          const hasChildren = Boolean(page.pages?.length);

          return (
            <div key={page.id} className="tree-node-wrapper">
              <TreeNodeHeader
                page={page}
                className={getItemClassName(page)}
                isExpanded={isExpanded}
                hasChildren={hasChildren}
                onItemClick={handleItemClick}
              />

              {hasChildren && page.pages && (
                <div
                  style={{ border: "2px solid green" }}
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
    },
    [pages, expandedIds, getItemClassName, handleItemClick]
  );

  return <div className="tree-view-container">{buildTree(topLevelIds)}</div>;
};

export default TreeView;
