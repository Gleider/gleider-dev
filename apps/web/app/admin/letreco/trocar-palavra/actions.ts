'use server';

import { letrecoPost, DailyWordEntry } from '../../../../lib/letreco-api';

export async function setTodayWord(wordId: number): Promise<{ ok: boolean; error?: string; dailyWord?: DailyWordEntry }> {
  try {
    const dailyWord = await letrecoPost<DailyWordEntry>('/admin/daily-words/today', { wordId });
    return { ok: true, dailyWord };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function forceRotation(): Promise<{ ok: boolean; error?: string; dailyWord?: DailyWordEntry }> {
  try {
    const dailyWord = await letrecoPost<DailyWordEntry>('/admin/daily-words/rotate', {});
    return { ok: true, dailyWord };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
