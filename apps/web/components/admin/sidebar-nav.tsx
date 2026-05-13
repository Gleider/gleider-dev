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
            className="block px-2 py-1.5 rounded-md transition-colors"
            style={{
              fontSize: '13px',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#ffffff' : '#666666',
              backgroundColor: isActive ? '#1a1a1a' : 'transparent',
              borderLeft: isActive ? '2px solid #4f7fff' : '2px solid transparent',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
