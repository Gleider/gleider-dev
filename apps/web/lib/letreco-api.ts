import { getAuthHeaders } from './api-server';

const base = () => process.env.LETRECO_API_URL ?? 'http://localhost:3002';

async function letrecoFetch(path: string, options?: RequestInit): Promise<Response> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${base()}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((error as { message?: string }).message || `Letreco API error ${res.status}`);
  }
  return res;
}

export const letrecoGet = <T>(path: string): Promise<T> =>
  letrecoFetch(path).then((r) => r.json() as Promise<T>);

export const letrecoPost = <T>(path: string, body: unknown): Promise<T> =>
  letrecoFetch(path, { method: 'POST', body: JSON.stringify(body) }).then(
    (r) => r.json() as Promise<T>,
  );

export const letrecoDelete = (path: string): Promise<void> =>
  letrecoFetch(path, { method: 'DELETE' }).then(() => undefined);

// Types for Letreco Admin API responses

export interface LetrecoWord {
  id: number;
  text: string;
  usedAt: string | null;
}

export interface WordsListResponse {
  words: LetrecoWord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DailyWordEntry {
  id: number;
  date: string;
  gameNumber: number | null;
  wordId: number;
  word: { id: number; text: string };
}

export interface TodayDailyWord extends DailyWordEntry {
  activeSessions: number;
}
