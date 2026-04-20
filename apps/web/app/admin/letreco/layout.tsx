'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin/letreco', label: 'Dashboard', exact: true },
  { href: '/admin/letreco/historico', label: 'Histórico' },
  { href: '/admin/letreco/catalogo', label: 'Catálogo' },
  { href: '/admin/letreco/trocar-palavra', label: 'Trocar Palavra' },
  { href: '/admin/letreco/agendar', label: 'Agendar' },
];

export default function LetreroAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <nav className="mb-8 border-b border-gray-800 flex gap-1">
        {TABS.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 text-sm font-medium transition-colors -mb-px ${
                isActive
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
