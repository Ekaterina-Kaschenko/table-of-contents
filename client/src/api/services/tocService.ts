export interface Page {
  id: string;
  title: string;
  url?: string;
  level: number;
  parentId?: string;
  pages?: string[];
}

export interface TOCData {
  entities: {
    pages: Record<string, Page>;
  };
  topLevelIds: string[];
}

export interface Anchor {
  id: string;
  title: string;
  url: string;
  anchor: string;
  level: number;
}

export async function fetchTOCData(): Promise<TOCData> {
  const response = await fetch('http://localhost:3001/api/mockedData');

  if (!response.ok) {
    throw new Error(`Failed to fetch TOC: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
