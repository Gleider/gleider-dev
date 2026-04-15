import { ImageResponse } from 'next/og';

export const alt = 'gleider.dev — blog, projetos e experiência profissional';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
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
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#f9fafb',
            marginBottom: 24,
          }}
        >
          gleider.dev
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#9ca3af',
            textAlign: 'center',
          }}
        >
          Blog, projetos e experiência profissional
        </div>
      </div>
    ),
    { ...size },
  );
}
