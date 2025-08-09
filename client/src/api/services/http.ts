export async function getJSON<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}