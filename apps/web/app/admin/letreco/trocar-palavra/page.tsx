import { letrecoGet, TodayDailyWord } from '../../../../lib/letreco-api';
import { TrocarPalavraClient } from './trocar-palavra-client';

export default async function TrocarPalavraPage() {
  const today = await letrecoGet<TodayDailyWord>('/admin/daily-words/today').catch(() => null);

  return <TrocarPalavraClient today={today} />;
}
