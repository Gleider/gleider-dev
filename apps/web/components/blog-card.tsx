import Link from 'next/link';
import type { PostMeta } from '@/lib/mdx';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex h-full flex-col rounded-lg border border-gray-800 bg-gray-900 p-6 transition-colors group-hover:border-gray-600">
        <time className="text-sm text-gray-500" dateTime={post.date}>
          {formatDate(post.date)}
        </time>

        <h2 className="mt-2 text-xl font-semibold text-white group-hover:text-gray-300 transition-colors">
          {post.title}
        </h2>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">
          {post.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
