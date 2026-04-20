import { apiServerGet, apiServerPost, apiServerDelete } from './api-server';

const base = () => process.env.LETRECO_API_URL ?? 'http://localhost:3002';

export const letrecoGet = <T>(path: string) => apiServerGet<T>(`${base()}${path}`);
export const letrecoPost = <T>(path: string, body: unknown) =>
  apiServerPost<T>(`${base()}${path}`, body);
export const letrecoDelete = (path: string) => apiServerDelete(`${base()}${path}`);

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
