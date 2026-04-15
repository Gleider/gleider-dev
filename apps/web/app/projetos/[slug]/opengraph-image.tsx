import { ImageResponse } from 'next/og';
import { ProjectType } from '@gleider-dev/shared';
import { getProject } from '@/lib/api';

export const alt = 'Projeto';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;

  let project;
  try {
    project = await getProject(slug);
  } catch {
    return fallbackImage();
  }

  if (project.type === ProjectType.EXTERNAL) {
    return fallbackImage();
  }

  const techDisplay = project.techStack.slice(0, 6);

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
            Projeto
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#f9fafb',
              lineHeight: 1.2,
              marginBottom: 32,
            }}
          >
            {project.name}
          </div>
          {techDisplay.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {techDisplay.map((tech) => (
                <div
                  key={tech}
                  style={{
                    backgroundColor: '#1f2937',
                    color: '#d1d5db',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 18,
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize: 24, color: '#9ca3af' }}>gleider.dev</div>
      </div>
    ),
    { ...size },
  );
}

function fallbackImage() {
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
        <div style={{ fontSize: 28, color: '#9ca3af' }}>Projetos</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
