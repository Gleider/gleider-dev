'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WordAutocomplete, SelectedWord } from '../../../../components/admin/letreco/word-autocomplete';
import { scheduleWord } from './actions';

interface Props {
  minDate: string;
}

const DAYS_PT = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

function dateHelperText(dateStr: string, minDate: string): { text: string; valid: boolean } {
  if (!dateStr) return { text: '', valid: false };
  if (dateStr < minDate) return { text: 'Data no passado — selecione uma data futura.', valid: false };
  if (dateStr === minDate) return { text: 'Isso é amanhã.', valid: true };

  const d = new Date(`${dateStr}T00:00:00Z`);
  const dayName = DAYS_PT[d.getUTCDay()];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const days = Math.round((d.getTime() - today.getTime()) / (24 * 3600 * 1000));
  return {
    text: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} · daqui a ${days} dias`,
    valid: true,
  };
}

export function AgendarForm({ minDate }: Props) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [selected, setSelected] = useState<SelectedWord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const helper = dateHelperText(date, minDate);
  const canSubmit = helper.valid && !!selected;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !selected) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await scheduleWord(date, selected.id);
      if (result.ok) {
        setSuccess(`${selected.text.toUpperCase()} agendada para ${new Date(`${date}T00:00:00Z`).toLocaleDateString('pt-BR')}`);
        setDate('');
        setSelected(null);
        router.refresh();
      } else {
        setError(result.error ?? 'Erro ao agendar palavra');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Data da rotação
        </label>
        <input
          type="date"
          value={date}
          min={minDate}
          onChange={(e) => { setDate(e.target.value); setError(''); }}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-gray-500 focus:outline-none"
        />
        {date && (
          <p className={`mt-1.5 text-xs ${helper.valid ? 'text-gray-400' : 'text-red-400'}`}>
            {helper.valid ? '✓ ' : '✗ '}{helper.text}
          </p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Palavra a reservar
        </label>
        <WordAutocomplete
          onSelect={setSelected}
          selected={selected}
          placeholder="Buscar palavra do catálogo..."
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-400">✓ {success}</p>}

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => { setDate(''); setSelected(null); setError(''); setSuccess(''); }}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 transition-colors flex items-center gap-2"
        >
          {loading && <span className="text-xs">↻</span>}
          {loading ? 'Agendando...' : '✓ Confirmar agendamento'}
        </button>
      </div>
    </form>
  );
}
