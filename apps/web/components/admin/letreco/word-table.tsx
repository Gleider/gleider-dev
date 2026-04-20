'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { deleteWord } from '../../../app/admin/letreco/catalogo/actions';
import type { WordsListResponse } from '../../../lib/letreco-api';

interface Props {
  data: WordsListResponse;
  currentPage: number;
  currentQ: string;
}

export function WordTable({ data, currentPage, currentQ }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(currentQ);
  const [deleting, setDeleting] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQ(currentQ);
  }, [currentQ]);

  const handleSearch = useCallback((value: string) => {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) params.set('q', value);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }, 300);
  }, [pathname, router]);

  async function handleDelete(id: number, text: string) {
    if (!confirm(`Remover "${text.toUpperCase()}" do catálogo?`)) return;
    setDeleting(id);
    try {
      const result = await deleteWord(id);
      if (!result.ok) alert(result.error ?? 'Erro ao remover palavra');
    } finally {
      setDeleting(null);
    }
  }

  const { words, total, pageSize } = data;
  const totalPages = Math.ceil(total / pageSize);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(start + words.length - 1, total);

  function pageLink(p: number) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('page', String(p));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar palavra..."
          className="w-64 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
        />
        <span className="text-sm text-gray-400">
          {total > 0
            ? `Mostrando ${start}–${end} de ${total}`
            : 'Nenhuma palavra encontrada'}
        </span>
      </div>

      {words.length === 0 ? (
        <p className="text-gray-400">Nenhuma palavra encontrada.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-gray-400">
                <th className="pb-3 font-medium">Palavra</th>
                <th className="pb-3 font-medium">Última utilização</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word) => (
                <tr key={word.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                  <td className="py-3 font-mono text-white uppercase">{word.text}</td>
                  <td className="py-3 text-gray-400">
                    {word.usedAt
                      ? new Date(word.usedAt).toLocaleDateString('pt-BR')
                      : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(word.id, word.text)}
                      disabled={deleting === word.id}
                      className="text-red-400 border border-red-900/50 rounded px-2 py-1 text-xs hover:border-red-500 disabled:opacity-50 transition-colors"
                    >
                      {deleting === word.id ? 'Removendo...' : 'Remover'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-2">
          {currentPage > 1 && (
            <Link
              href={pageLink(currentPage - 1)}
              className="rounded px-3 py-1 text-sm border border-gray-700 text-gray-300 hover:border-gray-500"
            >
              Anterior
            </Link>
          )}
          <span className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={pageLink(currentPage + 1)}
              className="rounded px-3 py-1 text-sm border border-gray-700 text-gray-300 hover:border-gray-500"
            >
              Próxima
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
