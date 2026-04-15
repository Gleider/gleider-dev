import Link from 'next/link';
import { apiServerGet } from '../../../lib/api-server';
import { ProjectTable } from '../../../components/admin/project-table';
import type { Project } from '@gleider-dev/shared';

export default async function AdminProjectsPage() {
  const projects = await apiServerGet<Project[]>('/projects');

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Projetos</h1>
        <Link
          href="/admin/projetos/novo"
          className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
        >
          Novo projeto
        </Link>
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
