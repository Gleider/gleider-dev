'use server';

import { revalidatePath } from 'next/cache';
import { letrecoPost, letrecoDelete, LetrecoWord } from '../../../../lib/letreco-api';

export async function addWord(text: string): Promise<{ ok: boolean; error?: string; word?: LetrecoWord }> {
  try {
    const word = await letrecoPost<LetrecoWord>('/admin/words', { text });
    revalidatePath('/admin/letreco/catalogo');
    return { ok: true, word };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function deleteWord(id: number): Promise<{ ok: boolean; error?: string }> {
  try {
    await letrecoDelete(`/admin/words/${id}`);
    revalidatePath('/admin/letreco/catalogo');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
