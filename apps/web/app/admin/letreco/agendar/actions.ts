'use server';

import { revalidatePath } from 'next/cache';
import { letrecoPost, letrecoDelete, DailyWordEntry } from '../../../../lib/letreco-api';

export async function scheduleWord(
  date: string,
  wordId: number,
): Promise<{ ok: boolean; error?: string; dailyWord?: DailyWordEntry }> {
  try {
    const dailyWord = await letrecoPost<DailyWordEntry>('/admin/daily-words/schedule', {
      date,
      wordId,
    });
    revalidatePath('/admin/letreco/agendar');
    revalidatePath('/admin/letreco/dashboard');
    return { ok: true, dailyWord };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function unscheduleWord(
  date: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await letrecoDelete(`/admin/daily-words/schedule/${date}`);
    revalidatePath('/admin/letreco/agendar');
    revalidatePath('/admin/letreco/dashboard');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
