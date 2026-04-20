'use client';

import { useEffect, useRef, useState, useCallback, KeyboardEvent } from 'react';
import { letrecoGet, LetrecoWord } from '../../../lib/letreco-api';

export interface SelectedWord {
  id: number;
  text: string;
  usedAt: string | null;
}

interface Props {
  onSelect: (word: SelectedWord | null) => void;
  selected: SelectedWord | null;
  placeholder?: string;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return <span className="uppercase">{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span className="uppercase">{text}</span>;
  return (
    <span className="uppercase">
      {text.slice(0, idx)}
      <span className="text-amber-400">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </span>
  );
}

function usageLabel(usedAt: string | null): React.ReactNode {
  if (!usedAt) return <span className="text-gray-500 text-xs">nunca usada</span>;
  const months = Math.floor((Date.now() - new Date(usedAt).getTime()) / (30 * 24 * 3600 * 1000));
  const isRecent = months < 12;
  return (
    <span className={`text-xs flex items-center gap-1 ${isRecent ? 'text-red-400' : 'text-gray-500'}`}>
      {isRecent && <span>⊘</span>}
      usada há {months} {months === 1 ? 'mês' : 'meses'}
      {isRecent && ' · indisponível'}
    </span>
  );
}

export function WordAutocomplete({ onSelect, selected, placeholder = 'Buscar palavra do catálogo...' }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LetrecoWord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const data = await letrecoGet<{ words: LetrecoWord[]; total: number }>(
        `/admin/words?q=${encodeURIComponent(q)}&pageSize=7`,
      );
      setResults(data.words);
      setTotal(data.total);
      setOpen(true);
      setActiveIdx(0);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  }

  function handleSelect(word: LetrecoWord) {
    onSelect({ id: word.id, text: word.text, usedAt: word.usedAt });
    setQuery('');
    setOpen(false);
    setResults([]);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[activeIdx]) handleSelect(results[activeIdx]); }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (selected) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
        <div className="flex items-start justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Você selecionou</p>
          <button
            onClick={() => onSelect(null)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Trocar seleção
          </button>
        </div>
        <p className="mt-2 text-3xl font-bold text-white tracking-widest uppercase">{selected.text}</p>
        <p className="mt-1 text-xs text-gray-500">
          {selected.usedAt
            ? `Última utilização: ${new Date(selected.usedAt).toLocaleDateString('pt-BR')}`
            : <span className="text-green-400">● Disponível · nunca usada</span>}
          {' · '}ID #{selected.id}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center rounded-lg border border-gray-700 bg-gray-900 px-3 py-2">
        <span className="text-gray-500 mr-2">⌕</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
        />
        {loading && <span className="text-gray-500 animate-spin text-xs">↻</span>}
        {!loading && query && results.length > 0 && (
          <span className="text-xs text-gray-500">{total} resultado{total !== 1 ? 's' : ''}</span>
        )}
      </div>

      {!loading && !open && !query && (
        <p className="mt-1 text-xs text-gray-600">Comece a digitar para buscar — mínimo 1 letra</p>
      )}

      {loading && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm text-gray-400">
          Buscando palavras com &ldquo;{query}&rdquo;...
        </div>
      )}

      {!loading && open && results.length === 0 && query && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm text-gray-400">
          Nenhuma palavra encontrada para &ldquo;{query}&rdquo;
        </div>
      )}

      {!loading && open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
          {results.map((word, idx) => (
            <button
              key={word.id}
              onClick={() => handleSelect(word)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                idx === activeIdx ? 'bg-gray-800' : 'hover:bg-gray-800/50'
              } ${idx === 0 ? 'rounded-t-lg' : ''} ${idx === results.length - 1 ? 'rounded-b-lg' : ''}`}
            >
              <span className="font-mono text-white">{highlight(word.text, query)}</span>
              {usageLabel(word.usedAt)}
            </button>
          ))}
          {total > 7 && (
            <p className="border-t border-gray-800 px-3 py-2 text-xs text-gray-500 flex justify-between">
              <span>Mostrando 7 de {total} · role para ver mais</span>
              <span className="text-gray-600">↑↓-navegar · ↵-selecionar · esc-fechar</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
