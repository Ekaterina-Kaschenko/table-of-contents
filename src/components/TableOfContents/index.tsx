import React, { useState, useMemo } from "react";
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

interface TOCProps {
  entities: {
    pages: Record<string, Page>;
  };
  topLevelIds: string[];
}

const buildTree = (ids: string[], pages: Record<string, Page>): Page[] => {
  return ids
    .map((id) => pages[id])
    .filter(Boolean)
    .sort((a, b) => (a.tabIndex ?? 0) - (b.tabIndex ?? 0));
};

const TableOfContents: React.FC<TOCProps> = ({ entities, topLevelIds }) => {
  const { pages } = entities;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [rootExpanded, setRootExpanded] = useState(true);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const allLevels = useMemo(() => {
    const levels = new Set<number>();
    Object.values(pages).forEach((page) => levels.add(page.level));
    return Array.from(levels).sort((a, b) => a - b);
  }, [pages]);

  const getBacklightLevels = () => {
    if (allLevels.length <= 1) return allLevels;
    if (allLevels.length === 2) return allLevels;
    return [allLevels[0], allLevels[allLevels.length - 1]];
  };

  const backlightLevels = getBacklightLevels();

  const renderNode = (page: Page): JSX.Element => {
    const isActive = activeId === page.id;
    const isExpanded = expandedIds.has(page.id);
    const hasChildren = !!page.pages?.length;
    const isBacklit =
      backlightLevels.includes(page.level) && hasChildren && isExpanded;

    const tocNodeClass = ["toc-node", isActive && hasChildren ? "active" : ""]
      .filter(Boolean)
      .join(" ");

    const children = page.pages?.map((childId) => {
      const child = pages[childId];
      return child ? renderNode(child) : null;
    });

    const content = (
      <>
        <div
          className={tocNodeClass}
          style={{ "--indent": `${page.level * 16}px` } as React.CSSProperties}
          tabIndex={0}
          onClick={() => {
            setActiveId(page.id);
            if (hasChildren) toggleExpand(page.id);
          }}
        >
          {hasChildren && (
            <span className={`arrow ${isExpanded ? "rotated" : ""}`}>▸</span>
          )}
          {page.title}
        </div>
        {isExpanded && children}
      </>
    );

    return (
      <div
        key={page.id}
        className={isBacklit ? "toc-group backlit" : "toc-group"}
      >
        {content}
      </div>
    );
  };

  const tree = useMemo(
    () => buildTree(topLevelIds, pages),
    [topLevelIds, pages]
  );

  return (
    <div className="toc-container">
      <div
        className="toc-root-toggle"
        onClick={() => setRootExpanded((prev) => !prev)}
      >
        <span className={`arrow ${rootExpanded ? "rotated" : ""}`}>▸</span>
        Topics
      </div>

      {rootExpanded && tree.map(renderNode)}
    </div>
  );
};

export default TableOfContents;
