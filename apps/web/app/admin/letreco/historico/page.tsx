import { letrecoGet, DailyWordEntry } from '../../../../lib/letreco-api';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default async function LetreroHistoricoPage() {
  const history = await letrecoGet<DailyWordEntry[]>('/admin/daily-words?limit=90');
  const activated = history.filter((d) => d.gameNumber !== null);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Histórico de palavras</h1>
      <p className="mt-1 text-sm text-gray-400">Últimas {activated.length} palavras selecionadas.</p>

      <div className="mt-6 overflow-x-auto">
        {activated.length === 0 ? (
          <p className="text-gray-400">Nenhuma palavra no histórico.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-gray-400">
                <th className="pb-3 font-medium">Data</th>
                <th className="pb-3 font-medium">Jogo #</th>
                <th className="pb-3 font-medium">Palavra</th>
              </tr>
            </thead>
            <tbody>
              {activated.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                  <td className="py-3 text-gray-400 capitalize">{formatDate(entry.date)}</td>
                  <td className="py-3 text-gray-300">#{entry.gameNumber}</td>
                  <td className="py-3 font-mono text-white uppercase">{entry.word.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
