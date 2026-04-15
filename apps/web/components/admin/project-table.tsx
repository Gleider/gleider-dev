'use client';

import Link from 'next/link';
import type { Project } from '@gleider-dev/shared';
import { deleteProject } from '../../app/actions/projects';
import { useState } from 'react';

export function ProjectTable({ projects }: { projects: Project[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;
    setDeleting(slug);
    try {
      await deleteProject(slug);
    } catch {
      alert('Erro ao excluir projeto');
    } finally {
      setDeleting(null);
    }
  }

  if (projects.length === 0) {
    return (
      <p className="text-gray-400 mt-6">Nenhum projeto encontrado.</p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-left text-gray-400">
            <th className="pb-3 font-medium">Nome</th>
            <th className="pb-3 font-medium">Slug</th>
            <th className="pb-3 font-medium">Tipo</th>
            <th className="pb-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="border-b border-gray-800/50 hover:bg-gray-900/50"
            >
              <td className="py-3 text-white">{project.name}</td>
              <td className="py-3 text-gray-400">{project.slug}</td>
              <td className="py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    project.type === 'INTERNAL'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-blue-900/30 text-blue-400'
                  }`}
                >
                  {project.type === 'INTERNAL' ? 'Interno' : 'Externo'}
                </span>
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/projetos/${project.slug}/editar`}
                    className="rounded-md px-3 py-1 text-sm text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(project.slug, project.name)}
                    disabled={deleting === project.slug}
                    className="rounded-md px-3 py-1 text-sm text-red-400 border border-red-900/50 hover:border-red-700 hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    {deleting === project.slug ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
