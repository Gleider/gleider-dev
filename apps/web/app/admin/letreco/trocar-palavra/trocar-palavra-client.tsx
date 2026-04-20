'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WordAutocomplete, SelectedWord } from '../../../../components/admin/letreco/word-autocomplete';
import { ConfirmDestructiveModal } from '../../../../components/admin/letreco/confirm-destructive-modal';
import { setTodayWord, forceRotation } from './actions';
import type { TodayDailyWord } from '../../../../lib/letreco-api';

interface Props {
  today: TodayDailyWord | null;
}

export function TrocarPalavraClient({ today }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<SelectedWord | null>(null);
  const [modalOpen, setModalOpen] = useState<'trocar' | 'forcar' | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleTrocar() {
    if (!selected) return;
    setLoading(true);
    try {
      const result = await setTodayWord(selected.id);
      if (result.ok) {
        showToast('success', `Palavra do dia trocada para ${result.dailyWord?.word.text.toUpperCase()} (jogo #${result.dailyWord?.gameNumber})`);
        setSelected(null);
        setModalOpen(null);
        router.refresh();
      } else {
        showToast('error', result.error ?? 'Erro ao trocar palavra');
        setModalOpen(null);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForcar() {
    setLoading(true);
    try {
      const result = await forceRotation();
      if (result.ok) {
        showToast('success', `Nova palavra sorteada: ${result.dailyWord?.word.text.toUpperCase()} (jogo #${result.dailyWord?.gameNumber})`);
        setModalOpen(null);
        router.refresh();
      } else {
        showToast('error', result.error ?? 'Erro ao forçar rotação');
        setModalOpen(null);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Trocar palavra do dia</h1>

      {today && (
        <div className="mt-2 text-sm text-gray-400">
          Palavra atual: <span className="font-mono text-white uppercase">{today.word.text}</span>
          {' '} (jogo #{today.gameNumber}) · {today.activeSessions} sessão{today.activeSessions !== 1 ? 'ões' : ''} ativa{today.activeSessions !== 1 ? 's' : ''}
        </div>
      )}

      {/* Section 1: Trocar para palavra específica */}
      <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-base font-semibold text-white mb-1">Trocar para palavra específica</h2>
        <p className="text-sm text-gray-400 mb-4">
          Busque e selecione a palavra que deve valer para hoje.
        </p>
        <WordAutocomplete
          onSelect={setSelected}
          selected={selected}
        />
        {selected && (
          <div className="mt-4">
            <button
              onClick={() => setModalOpen('trocar')}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 hover:bg-gray-200 transition-colors"
            >
              Trocar palavra de hoje para {selected.text.toUpperCase()}
            </button>
          </div>
        )}
      </div>

      {/* Section 2: Forçar rotação aleatória */}
      <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-base font-semibold text-white mb-1">Forçar nova rotação aleatória</h2>
        <p className="text-sm text-gray-400 mb-4">
          Sorteia uma nova palavra do catálogo seguindo a mesma lógica do cron diário. Sessões em jogo serão encerradas.
        </p>
        <button
          onClick={() => setModalOpen('forcar')}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-500 transition-colors"
        >
          Forçar nova rotação
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toast.type === 'success'
              ? 'border-green-800 bg-green-950 text-green-300'
              : 'border-red-800 bg-red-950 text-red-300'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {modalOpen === 'trocar' && selected && (
        <ConfirmDestructiveModal
          open
          onClose={() => !loading && setModalOpen(null)}
          onConfirm={handleTrocar}
          variant="trocar"
          todayWord={today ? { text: today.word.text, gameNumber: today.gameNumber } : undefined}
          afterWord={{ text: selected.text }}
          impact={today ? { sessions: today.activeSessions, nextGameNumber: (today.gameNumber ?? 0) + 1 } : undefined}
          loading={loading}
        />
      )}

      {modalOpen === 'forcar' && (
        <ConfirmDestructiveModal
          open
          onClose={() => !loading && setModalOpen(null)}
          onConfirm={handleForcar}
          variant="forcar"
          todayWord={today ? { text: today.word.text, gameNumber: today.gameNumber } : undefined}
          impact={today ? { sessions: today.activeSessions, nextGameNumber: (today.gameNumber ?? 0) + 1 } : undefined}
          loading={loading}
        />
      )}
    </div>
  );
}
