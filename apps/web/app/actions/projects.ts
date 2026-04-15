'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiServerPost, apiServerPut, apiServerDelete } from '../../lib/api-server';

export async function createProject(formData: FormData) {
  const body = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    url: (formData.get('url') as string) || undefined,
    imageUrl: (formData.get('imageUrl') as string) || undefined,
    tags: (formData.get('tags') as string)
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean) ?? [],
    techStack: (formData.get('techStack') as string)
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean) ?? [],
  };

  await apiServerPost('/projects', body);

  revalidatePath('/projetos');
  revalidatePath('/admin/projetos');
  redirect('/admin/projetos');
}

export async function updateProject(slug: string, formData: FormData) {
  const body = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    url: (formData.get('url') as string) || undefined,
    imageUrl: (formData.get('imageUrl') as string) || undefined,
    tags: (formData.get('tags') as string)
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean) ?? [],
    techStack: (formData.get('techStack') as string)
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean) ?? [],
  };

  await apiServerPut(`/projects/${slug}`, body);

  revalidatePath('/projetos');
  revalidatePath('/admin/projetos');
  redirect('/admin/projetos');
}

export async function deleteProject(slug: string) {
  await apiServerDelete(`/projects/${slug}`);

  revalidatePath('/projetos');
  revalidatePath('/admin/projetos');
}
