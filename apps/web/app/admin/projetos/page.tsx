import Link from 'next/link';
import { apiServerGet } from '../../../lib/api-server';
import { ProjectTable } from '../../../components/admin/project-table';
import type { Project } from '@gleider-dev/shared';

export default async function AdminProjectsPage() {
  const projects = await apiServerGet<Project[]>('/projects');

  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-[12px]">
        <Link href="/admin" className="text-[#444444] hover:text-white transition-colors">Admin</Link>
        <span className="text-[#333333]" aria-hidden="true">/</span>
        <span className="text-white" aria-current="page">Projetos</span>
      </nav>

      <div className="flex items-center justify-between mb-10">
        <h1 className="font-extrabold text-[42px] text-white tracking-[-0.03em] leading-none">
          Projetos
        </h1>
        <Link
          href="/admin/projetos/novo"
          className="inline-flex items-center rounded-lg bg-white text-[#0a0a0a] px-4 py-2 text-[13px] font-medium hover:bg-[#e5e5e5] transition-colors"
        >
          Novo projeto
        </Link>
      </div>

      <ProjectTable projects={projects} />
    </div>
  );
}
