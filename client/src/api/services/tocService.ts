export type Page = {
  id: string;
  title: string;
  level: number;
  parentId?: string;
  pages?: string[];
  url?: string;
};

export type TreeViewProps = {
  entities: { pages: Record<string, Page> };
  topLevelIds: string[];
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const PARAM = "searchParams";

import { getJSON } from "@/api/services/http";

export async function fetchTOCData(q = "", signal?: AbortSignal): Promise<TreeViewProps> {
  const url = new URL(`${API_BASE}/api/mockedData`, window.location.origin);
  if (q.trim()) url.searchParams.set(PARAM, q.trim());
  return getJSON<TreeViewProps>(url.toString(), { signal });
}
