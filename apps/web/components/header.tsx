import Link from 'next/link';
import { Nav } from './nav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-white hover:text-gray-300 transition-colors">
          gleider.dev
        </Link>
        <Nav />
      </div>
    </header>
  );
}
