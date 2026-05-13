'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-2 py-1.5 rounded-md transition-colors text-[13px] border-l-2 ${
              isActive
                ? 'bg-[#1a1a1a] font-medium text-white border-[#4f7fff]'
                : 'text-[#666666] border-transparent hover:text-[#aaaaaa]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
