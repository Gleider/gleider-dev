'use client';

import { useEffect, useRef, useState } from 'react';

export type ModalVariant = 'trocar' | 'forcar';

interface Impact {
  sessions: number;
  nextGameNumber: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  variant: ModalVariant;
  todayWord?: { text: string; gameNumber: number | null };
  afterWord?: { text: string };
  impact?: Impact;
  loading: boolean;
}

const COPY = {
  trocar: {
    title: 'Trocar a palavra de hoje?',
    description: 'Esta ação encerra todos os jogos em andamento.',
    confirmLabel: 'Trocar palavra',
    confirmingLabel: 'Trocando...',
  },
  forcar: {
    title: 'Forçar nova rotação aleatória?',
    description: 'Uma palavra aleatória disponível será sorteada. Esta ação encerra os jogos em andamento.',
    confirmLabel: 'Sortear nova palavra',
    confirmingLabel: 'Sorteando...',
  },
};

export function ConfirmDestructiveModal({
  open,
  onClose,
  onConfirm,
  variant,
  todayWord,
  afterWord,
  impact,
  loading,
}: Props) {
  const [typed, setTyped] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const copy = COPY[variant];
  const confirmWord = variant === 'trocar' ? afterWord?.text : undefined;
  const isConfirmed = confirmWord
    ? typed.trim().toLowerCase() === confirmWord.toLowerCase()
    : typed.trim().toLowerCase() === 'sortear';

  useEffect(() => {
    if (open) {
      setTyped('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
        <div className="flex gap-3 items-start mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-950 border border-red-800 flex items-center justify-center">
            <span className="text-red-400 text-lg">⚠</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{copy.title}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{copy.description}</p>
          </div>
        </div>

        {/* Transition preview */}
        {todayWord && (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 mb-4 flex items-center gap-3">
            <div>
              <p className="text-xs text-gray-500">HOJE (#{todayWord.gameNumber ?? '?'})</p>
              <p className="font-mono text-gray-500 line-through uppercase text-lg">{todayWord.text}</p>
            </div>
            <span className="text-gray-600 text-xl">→</span>
            <div>
              <p className="text-xs text-gray-500">APÓS {variant === 'trocar' ? 'TROCA' : 'ROTAÇÃO'}</p>
              <p className={`font-mono uppercase text-lg font-bold ${afterWord ? 'text-white' : 'text-gray-400'}`}>
                {afterWord?.text ?? '???'}
              </p>
            </div>
          </div>
        )}

        {/* Impact */}
        {impact && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">O que vai acontecer</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-400 font-bold">{impact.sessions}</span>
                <span className="text-gray-300">sessões em jogo serão encerradas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">+1</span>
                <span className="text-gray-300">jogo abre — número #{impact.nextGameNumber}</span>
              </div>
            </div>
          </div>
        )}

        {/* Typed confirmation */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">
            Para confirmar, digite{' '}
            <span className="font-mono text-white uppercase">
              {confirmWord ?? 'SORTEAR'}
            </span>
          </p>
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && !loading && onClose()}
            placeholder={confirmWord ?? 'SORTEAR'}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none font-mono uppercase"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-500 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isConfirmed || loading}
            className="flex-1 rounded-lg border border-red-800 bg-red-950 px-4 py-2 text-sm font-medium text-red-400 hover:border-red-600 disabled:opacity-40 transition-colors"
          >
            {loading ? copy.confirmingLabel : copy.confirmLabel}
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-gray-600">
          Sem desfazer · operação aplicada imediatamente
        </p>
      </div>
    </div>
  );
}
