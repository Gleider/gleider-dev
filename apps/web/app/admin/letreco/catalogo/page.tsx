import { letrecoGet, WordsListResponse } from '../../../../lib/letreco-api';
import { WordTable } from '../../../../components/admin/letreco/word-table';
import { AddWordModal } from '../../../../components/admin/letreco/add-word-modal';

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function LetrecoCatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, page } = await searchParams;
  const pageNum = Number(page) || 1;

  const data = await letrecoGet<WordsListResponse>(
    `/admin/words?q=${encodeURIComponent(q ?? '')}&page=${pageNum}&pageSize=50`,
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Catálogo de palavras</h1>
        <AddWordModal />
      </div>
      <WordTable data={data} currentPage={pageNum} currentQ={q ?? ''} />
    </div>
  );
}
