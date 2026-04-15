import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import { BlogCard } from '@/components/blog-card';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos sobre desenvolvimento web, arquitetura de software e carreira.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-white">Blog</h1>
      <p className="mt-2 text-lg text-gray-400">
        Artigos sobre desenvolvimento, arquitetura e aprendizados.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 text-gray-500">Nenhum post publicado ainda.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
