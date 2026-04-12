import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectType } from '@gleider-dev/shared';
import { getProject } from '@/lib/api';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await getProject(slug);
    return {
      title: project.name,
      description: project.description,
    };
  } catch {
    return { title: 'Projeto nao encontrado' };
  }
}

export default async function ProjetoPage({ params }: PageProps) {
  const { slug } = await params;

  let project;

  try {
    project = await getProject(slug);
  } catch {
    notFound();
  }

  if (project.type === ProjectType.EXTERNAL) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/projetos"
        className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        Voltar aos projetos
      </Link>

      <h1 className="mt-8 text-4xl font-bold tracking-tight text-white">
        {project.name}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-green-950 px-2.5 py-0.5 text-xs font-medium text-green-300">
          Interno
        </span>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-gray-300">
        {project.description}
      </div>

      {project.techStack.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Tech Stack
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.url && (
        <div className="mt-10">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Ver repositorio
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
}
