import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/mdx';

export const alt = 'Blog post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030712',
            padding: 80,
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700, color: '#f9fafb' }}>
            gleider.dev
          </div>
          <div style={{ fontSize: 28, color: '#9ca3af' }}>Blog</div>
        </div>
      ),
      { ...size },
    );
  }

  const title =
    post.title.length > 60 ? post.title.slice(0, 57) + '...' : post.title;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#030712',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 24,
              color: '#6b7280',
              marginBottom: 16,
              textTransform: 'uppercase' as const,
              letterSpacing: 2,
            }}
          >
            Blog
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#f9fafb',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 24, color: '#9ca3af' }}>gleider.dev</div>
          <div style={{ fontSize: 20, color: '#6b7280' }}>{post.date}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
