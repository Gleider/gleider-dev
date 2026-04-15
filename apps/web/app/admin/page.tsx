import { apiServerGet } from '../../lib/api-server';
import type { Project } from '@gleider-dev/shared';
import Link from 'next/link';

export default async function AdminDashboard() {
  const projects = await apiServerGet<Project[]>('/projects');

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/projetos"
          className="rounded-lg border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors"
        >
          <p className="text-3xl font-bold text-white">{projects.length}</p>
          <p className="mt-1 text-sm text-gray-400">Projetos</p>
        </Link>
      </div>
    </div>
  );
}
