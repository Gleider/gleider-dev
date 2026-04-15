'use client';

import type { Project } from '@gleider-dev/shared';

interface ProjectFormProps {
  project?: Project;
  action: (formData: FormData) => Promise<void>;
}

export function ProjectForm({ project, action }: ProjectFormProps) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Nome *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={project?.name}
          required
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-300">
          Slug *
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          defaultValue={project?.slug}
          required
          pattern="[a-z0-9-]+"
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
          placeholder="meu-projeto"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Descrição *
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={project?.description}
          required
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-300">
          Tipo *
        </label>
        <select
          id="type"
          name="type"
          defaultValue={project?.type ?? 'INTERNAL'}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-gray-500 focus:outline-none"
        >
          <option value="INTERNAL">Interno (rota no site)</option>
          <option value="EXTERNAL">Externo (link externo)</option>
        </select>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-300">
          URL (para projetos externos)
        </label>
        <input
          type="url"
          id="url"
          name="url"
          defaultValue={project?.url ?? ''}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
          placeholder="https://exemplo.gleider.dev"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300">
          URL da imagem
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          defaultValue={project?.imageUrl ?? ''}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
          Tags (separadas por vírgula)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          defaultValue={project?.tags?.join(', ')}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
          placeholder="pessoal, portfólio, blog"
        />
      </div>

      <div>
        <label htmlFor="techStack" className="block text-sm font-medium text-gray-300">
          Tech Stack (separadas por vírgula)
        </label>
        <input
          type="text"
          id="techStack"
          name="techStack"
          defaultValue={project?.techStack?.join(', ')}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
          placeholder="Next.js, NestJS, PostgreSQL"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
        >
          {project ? 'Salvar alterações' : 'Criar projeto'}
        </button>
        <a
          href="/admin/projetos"
          className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
