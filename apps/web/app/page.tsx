import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-10rem)] flex-col justify-center py-20">
        <div className="flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:gap-16">
          <div className="flex-1">
            <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">
              Olá, eu sou
            </p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Gleider Mackedanz
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
              Software Engineer na{' '}
              <span className="text-gray-200">Twism</span>, fintech da
              Califórnia onde trabalho com plataforma de fidelidade e moedas
              digitais personalizadas. Atuo na área de desenvolvimento desde 2017 e
              atualmente me aprofundo em{' '}
              <span className="text-gray-200">ciência de dados</span> — a área
              que mais tenho estudado. Sou curioso por natureza e gosto de
              explorar diferentes campos do conhecimento.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
              Fora do código, gosto de ler, assistir filmes e séries, jogar e
              tocar guitarra e baixo.
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
                Experiência
              </Link>
            </div>
          </div>
          <div className="relative flex-shrink-0">
            <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-gray-800 sm:h-52 sm:w-52">
              <Image
                src="/images/profile-guitar.jpeg"
                alt="Gleider Mackedanz"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
