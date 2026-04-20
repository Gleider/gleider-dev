'use client';

import { useState } from 'react';
import { DailyWordEntry } from '../../../lib/letreco-api';
import { unscheduleWord } from '../../../app/admin/letreco/agendar/actions';

interface Props {
  items: DailyWordEntry[];
}

const DAY_ABBR = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MONTH_ABBR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function daysBetween(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (24 * 3600 * 1000));
}

function dateBadge(dateStr: string): string | null {
  const days = daysBetween(dateStr);
  if (days === 1) return 'AMANHÃ';
  if (days <= 3) return 'EM BREVE';
  return null;
}

function toISODate(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10);
}

export function ScheduledWordsList({ items }: Props) {
  const [removing, setRemoving] = useState<string | null>(null);

  async function handleUnschedule(entry: DailyWordEntry) {
    const dateLabel = new Date(entry.date).toLocaleDateString('pt-BR');
    if (!confirm(`Desagendar ${entry.word.text.toUpperCase()} de ${dateLabel}?`)) return;
    const isoDate = toISODate(entry.date);
    setRemoving(isoDate);
    try {
      const result = await unscheduleWord(isoDate);
      if (!result.ok) alert(result.error ?? 'Erro ao desagendar');
    } finally {
      setRemoving(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-sm text-gray-400">
        Nenhum agendamento. A próxima palavra será sorteada automaticamente pelo cron.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((entry) => {
        const d = new Date(entry.date);
        const badge = dateBadge(entry.date);
        const days = daysBetween(entry.date);
        const isoDate = toISODate(entry.date);
        const isRemoving = removing === isoDate;

        return (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3"
          >
            <div className="flex-shrink-0 text-center w-10">
              <p className="text-xs text-gray-500">{MONTH_ABBR[d.getUTCMonth()]}</p>
              <p className="text-lg font-bold text-white leading-none">{d.getUTCDate()}</p>
              <p className="text-xs text-gray-500">{DAY_ABBR[d.getUTCDay()]}</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-white uppercase font-semibold">{entry.word.text}</span>
                {badge && (
                  <span className="rounded px-1.5 py-0.5 text-xs bg-green-900/40 text-green-400 border border-green-800/50">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                daqui a {days} dia{days !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => handleUnschedule(entry)}
              disabled={isRemoving}
              className="flex-shrink-0 rounded border border-gray-700 px-3 py-1 text-xs text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-50 transition-colors"
            >
              {isRemoving ? '...' : 'Desagendar'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
