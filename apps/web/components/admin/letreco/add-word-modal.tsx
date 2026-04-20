'use client';

import { useRef, useState } from 'react';
import { addWord } from '../../../app/admin/letreco/catalogo/actions';

const WORD_REGEX = /^[a-z]{5}$/;

export function AddWordModal() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function openModal() {
    setOpen(true);
    setError('');
    setText('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function closeModal() {
    setOpen(false);
    setError('');
    setText('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = text.trim().toLowerCase();
    if (!WORD_REGEX.test(normalized)) {
      setError('A palavra deve ter exatamente 5 letras minúsculas (a-z)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await addWord(normalized);
      if (result.ok) {
        closeModal();
      } else {
        setError(result.error ?? 'Erro ao adicionar palavra');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
      >
        Adicionar palavra
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">Adicionar palavra</h2>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => { setText(e.target.value); setError(''); }}
                placeholder="Digite uma palavra de 5 letras"
                maxLength={5}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none font-mono uppercase"
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
              <div className="mt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !text.trim()}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
