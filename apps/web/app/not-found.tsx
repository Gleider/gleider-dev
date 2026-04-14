import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center py-20 text-center">
        <p className="text-8xl font-bold text-gray-700">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-white">Página não encontrada</h1>
        <p className="mt-2 text-gray-400">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
        >
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
