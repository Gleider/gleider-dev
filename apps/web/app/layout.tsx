import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'gleider.dev',
    template: '%s | gleider.dev',
  },
  description: 'Site pessoal de Gleider — blog, projetos e experiência profissional.',
  metadataBase: new URL('https://gleider.dev'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'gleider.dev',
    title: 'gleider.dev',
    description: 'Site pessoal de Gleider — blog, projetos e experiência profissional.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans bg-gray-950 text-gray-100 antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
