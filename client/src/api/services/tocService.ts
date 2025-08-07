export interface Page {
  id: string;
  title: string;
  url?: string;
  level: number;
  parentId?: string;
  pages?: string[];
}

export interface TreeViewProps {
  entities: {
    pages: Record<string, Page>;
  };
  topLevelIds: string[];
}

export async function fetchTOCData(): Promise<TreeViewProps> {
  const response = await fetch('http://localhost:3001/api/mockedData');

  if (!response.ok) {
    throw new Error(`Failed to fetch TOC: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
