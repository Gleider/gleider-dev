import Link from 'next/link';
import { letrecoGet, TodayDailyWord, DailyWordEntry, WordsListResponse } from '../../../../lib/letreco-api';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default async function LetrecoDashboardPage() {
  const [today, history, catalog] = await Promise.all([
    letrecoGet<TodayDailyWord>('/admin/daily-words/today').catch(() => null),
    letrecoGet<DailyWordEntry[]>('/admin/daily-words?limit=30').catch(() => null),
    letrecoGet<WordsListResponse>('/admin/words?pageSize=1').catch(() => null),
  ]);

  const pendingScheduled = (history ?? []).filter(
    (d) => d.gameNumber === null && new Date(d.date) > new Date(),
  );

  return (
    <div>
      <h1 className="font-extrabold text-[42px] text-white tracking-[-0.03em] leading-none mb-8">Letreco</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Palavra de hoje */}
        <div className="col-span-full rounded-xl border border-[#1f1f1f] bg-[#111111] p-[20px_24px]">
          {today ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Palavra de hoje</p>
                <p className="text-5xl font-bold text-white tracking-widest uppercase">
                  {today.word.text}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Jogo #{today.gameNumber ?? <span className="text-amber-400">Aguardando ativação</span>}
                  {' · '}{formatDate(today.date)}
                  {' · '}{today.activeSessions} sessão{today.activeSessions !== 1 ? 'ões' : ''} ativa{today.activeSessions !== 1 ? 's' : ''}
                </p>
              </div>
              <Link
                href="/admin/letreco/trocar-palavra"
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-500 whitespace-nowrap transition-colors"
              >
                Trocar palavra
              </Link>
            </div>
          ) : (
            <p className="text-gray-400">Sem palavra configurada para hoje.</p>
          )}
        </div>

        {/* Total no catálogo */}
        <Link
          href="/admin/letreco/catalogo"
          className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-[20px_24px] hover:border-[#2f2f2f] transition-colors"
        >
          <p className="font-extrabold text-[34px] text-white tracking-[-0.03em] leading-none">{catalog?.total.toLocaleString('pt-BR') ?? '–'}</p>
          <p className="mt-2 font-semibold uppercase text-[11px] text-[#444444] tracking-[0.08em]">Palavras no catálogo</p>
        </Link>

        {/* Agendamentos pendentes */}
        <Link
          href="/admin/letreco/agendar"
          className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-[20px_24px] hover:border-[#2f2f2f] transition-colors"
        >
          <p className="font-extrabold text-[34px] text-white tracking-[-0.03em] leading-none">{pendingScheduled.length}</p>
          <p className="mt-2 font-semibold uppercase text-[11px] text-[#444444] tracking-[0.08em]">Agendamentos pendentes</p>
          {pendingScheduled.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              Próximo: {pendingScheduled.sort((a, b) => a.date.localeCompare(b.date))[0]?.word.text.toUpperCase()}
            </p>
          )}
        </Link>

        {/* Link para histórico */}
        <Link
          href="/admin/letreco/historico"
          className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-[20px_24px] hover:border-[#2f2f2f] transition-colors"
        >
          <p className="font-extrabold text-[34px] text-white tracking-[-0.03em] leading-none">{(history ?? []).filter(d => d.gameNumber !== null).length}</p>
          <p className="mt-2 font-semibold uppercase text-[11px] text-[#444444] tracking-[0.08em]">Jogos no histórico recente</p>
        </Link>
      </div>
    </div>
  );
}
