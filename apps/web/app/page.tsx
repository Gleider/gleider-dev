import Link from 'next/link';

export default function Home() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-10rem)] flex-col justify-center py-20">
        <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">
          Ola, eu sou
        </p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Gleider
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          Desenvolvedor de software apaixonado por construir produtos digitais de qualidade.
          Compartilho aqui meus projetos, experiencias e aprendizados.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/projetos"
            className="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
          >
            Ver projetos
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Ler blog
          </Link>
          <Link
            href="/experiencia"
            className="inline-flex items-center rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Experiencia
          </Link>
        </div>
      </div>
    </section>
  );
}
