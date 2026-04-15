import type { MetadataRoute } from 'next';
import { ProjectType } from '@gleider-dev/shared';
import { getAllPosts } from '@/lib/mdx';
import { getProjects } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gleider.dev';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/projetos`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/experiencia`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const posts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date + 'T12:00:00'),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjects();
    projectRoutes = projects
      .filter((p) => p.type === ProjectType.INTERNAL)
      .map((project) => ({
        url: `${baseUrl}/projetos/${project.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
  } catch {
    // API unavailable — sitemap still returns static routes and blog posts
  }

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
