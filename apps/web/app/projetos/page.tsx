import type { Metadata } from 'next';
import { getProjects } from '@/lib/api';
import { ProjectCard } from '@/components/project-card';

export const metadata: Metadata = {
  title: 'Projetos',
  description: 'Projetos desenvolvidos por Gleider — aplicações web, ferramentas e experimentos.',
};

export default async function ProjetosPage() {
  let projects;
  let error: string | null = null;

  try {
    projects = await getProjects();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : 'Não foi possível carregar os projetos. Tente novamente mais tarde.';
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-white">Projetos</h1>
      <p className="mt-2 text-lg text-gray-400">
        Aplicações, ferramentas e experimentos que construí ou mantenho.
      </p>

      {error ? (
        <div className="mt-12 rounded-lg border border-red-900 bg-red-950/50 p-6 text-center">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">Nenhum projeto encontrado.</p>
        </div>
      )}
    </section>
  );
}
