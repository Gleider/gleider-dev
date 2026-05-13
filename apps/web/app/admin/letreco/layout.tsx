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
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[12px]">
        <Link href="/admin" className="text-[#444444] hover:text-white transition-colors">Admin</Link>
        <span className="text-[#333333]" aria-hidden="true">/</span>
        <span className="text-white" aria-current="page">Letreco</span>
      </nav>

      <nav className="mb-8 flex gap-1 border-b border-[#1f1f1f]">
        {TABS.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`transition-colors -mb-px text-[13px] px-4 py-2 border-b-2 ${
                isActive
                  ? 'font-medium text-white border-white'
                  : 'text-[#555555] border-transparent hover:text-[#aaaaaa]'
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
