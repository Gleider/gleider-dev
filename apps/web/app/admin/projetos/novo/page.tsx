import { ProjectForm } from '../../../../components/admin/project-form';
import { createProject } from '../../../actions/projects';

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Novo projeto</h1>
      <ProjectForm action={createProject} />
    </div>
  );
}
