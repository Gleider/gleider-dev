import type { Project, Experience } from '@gleider-dev/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Erro ao buscar ${path}: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function getProjects(): Promise<Project[]> {
  return fetchAPI<Project[]>('/projects');
}

export function getProject(slug: string): Promise<Project> {
  return fetchAPI<Project>(`/projects/${slug}`);
}

export function getExperiences(): Promise<Experience[]> {
  return fetchAPI<Experience[]>('/experience');
}
