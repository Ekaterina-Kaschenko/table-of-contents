import {
  useRef,
  useState,
  JSX,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { flushSync } from "react-dom";
import TreeNodeHeader from "../TreeNodeHeader";
import { Page, TreeViewProps } from "@/api/services/tocService";
import "./styles.scss";

export interface TreeViewHandle {
  setActiveById: (id: string) => void;
}

const TreeView = forwardRef<TreeViewHandle, TreeViewProps>(
  ({ entities, topLevelIds }, ref) => {
    const { pages } = entities;

    const [activeId, setActiveId] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const elRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

    const toggleExpand = (id: string) => {
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
      if (!activeId) return false;
      if (pageId === activeId) return true;
      let current = pages[activeId];
      while (current?.parentId) {
        if (current.parentId === pageId) return true;
        current = pages[current.parentId];
      }
      return false;
    };

    const getItemClassName = (page: Page) =>
      activeId === page.id
        ? "selected"
        : isInActivePath(page.id)
        ? "highlighted"
        : "";

    const smoothScrollTo = (id: string) => {
      // wait for headers of expanded parents to exist
      queueMicrotask(() => {
        requestAnimationFrame(() => {
          elRefs.current.get(id)?.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        });
      });
    };

    const handleItemClick = (page: Page) => {
      setActiveId(page.id);
      if (page.pages?.length) toggleExpand(page.id);
    };

    // ---- reveal & select by id (with optional scroll) ----
    const reveal = (id: string, scroll: boolean = true) => {
      if (!pages[id]) return;

      // collect parents
      const parents: string[] = [];
      let cur = pages[id];
      while (cur?.parentId) {
        parents.push(cur.parentId);
        cur = pages[cur.parentId];
      }

      // expand parents (sync)
      flushSync(() => {
        setExpandedIds((prev) => {
          const next = new Set(prev);
          parents.forEach((pid) => next.add(pid));
          return next;
        });
      });

      // set active (sync)
      flushSync(() => setActiveId(id));

      if (scroll) smoothScrollTo(id);
    };

    // expose public API (keeps scrolling behavior)
    useImperativeHandle(ref, () => ({
      setActiveById: (id: string) => reveal(id, true),
    }));

    // listen for global "set active" with optional scroll flag
    useEffect(() => {
      const handler = (e: Event) => {
        const { id, scroll = true } =
          (e as CustomEvent<{ id: string; scroll?: boolean }>).detail || {};
        if (id) reveal(id, scroll);
      };
      window.addEventListener("toc:set-active", handler as EventListener);
      return () =>
        window.removeEventListener("toc:set-active", handler as EventListener);
      // eslint-disable-next-line
    }, [pages]);

    const renderTree = (ids: string[]): JSX.Element[] =>
      ids
        .map((id) => {
          const page = pages[id];
          if (!page) return null;

          const hasChildren = !!page.pages?.length;
          const isExpanded = expandedIds.has(page.id);

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
                nodeRef={(el) => {
                  if (el) elRefs.current.set(page.id, el);
                  else elRefs.current.delete(page.id);
                }}
              />
              {hasChildren && (
                <div
                  className={`tree-node-children ${
                    isExpanded ? "expanded" : "collapsed"
                  }`}
                >
                  {renderTree(page.pages!)}
                </div>
              )}
            </div>
          );
        })
        .filter((n): n is JSX.Element => n !== null);

    return <div className="tree-view-container">{renderTree(topLevelIds)}</div>;
  }
);

export default TreeView;
