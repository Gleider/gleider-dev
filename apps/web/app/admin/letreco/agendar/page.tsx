import { letrecoGet, DailyWordEntry } from '../../../../lib/letreco-api';
import { ScheduledWordsList } from '../../../../components/admin/letreco/scheduled-words-list';
import { AgendarForm } from './agendar-form';

export default async function AgendarPage() {
  const history = await letrecoGet<DailyWordEntry[]>('/admin/daily-words?limit=60');

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const pending = history
    .filter((d) => d.gameNumber === null && new Date(d.date) > today)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Min date for the date picker (tomorrow)
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">Agendar palavra</h1>
        <span className="rounded-full bg-blue-900/30 border border-blue-800/50 px-2.5 py-0.5 text-xs text-blue-400 font-medium">
          FUTURO APENAS
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        Reserve uma palavra para uma data específica. A rotação ocorre às 12:00 BRT (15:00 UTC).
        Datas passadas e a de hoje não são selecionáveis.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <AgendarForm minDate={minDate} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Agendamentos pendentes</h2>
            <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
              {pending.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3">Ordenado por data crescente. Apenas os 30 próximos dias.</p>
          <ScheduledWordsList items={pending} />
        </div>
      </div>
    </div>
  );
}
