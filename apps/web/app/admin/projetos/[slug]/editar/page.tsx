import { notFound } from 'next/navigation';
import { ProjectForm } from '../../../../../components/admin/project-form';
import { updateProject } from '../../../../actions/projects';
import { apiServerGet } from '../../../../../lib/api-server';
import type { Project } from '@gleider-dev/shared';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project: Project;
  try {
    project = await apiServerGet<Project>(`/projects/${slug}`);
  } catch {
    notFound();
  }

  const updateWithSlug = updateProject.bind(null, slug);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Editar projeto</h1>
      <ProjectForm project={project} action={updateWithSlug} />
    </div>
  );
}
