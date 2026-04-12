import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'gleider.dev',
  description: 'Site pessoal de Gleider',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
