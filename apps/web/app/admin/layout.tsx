import Link from 'next/link';
import { auth, signOut } from '../../auth';
import { SidebarNav } from '../../components/admin/sidebar-nav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <aside className="flex flex-col flex-shrink-0 w-[240px] bg-[#111111] border-r border-[#1f1f1f]">
        <div className="px-5 py-6 border-b border-[#1f1f1f]">
          <Link href="/admin">
            <span className="block font-bold text-[15px] text-white tracking-[-0.02em]">
              gleider.dev
            </span>
            <span className="block font-semibold uppercase text-[10px] text-[#444444] tracking-[0.1em] mt-0.5">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
          <span className="block px-2 font-semibold uppercase text-[10px] text-[#333333] tracking-[0.1em] mb-1.5">
            Site
          </span>
          <SidebarNav
            items={[
              { href: '/admin', label: 'Dashboard', exact: true },
              { href: '/admin/projetos', label: 'Projetos' },
            ]}
          />

          <span className="block px-2 font-semibold uppercase text-[10px] text-[#333333] tracking-[0.1em] mb-1.5 mt-4">
            Projetos
          </span>
          <SidebarNav
            items={[
              { href: '/admin/letreco', label: 'Letreco' },
              { href: '/admin/zelar', label: 'Zelar' },
            ]}
          />

          <div className="mt-4">
            <Link
              href="/"
              className="block px-2 py-1.5 rounded-md text-[13px] text-[#444444] hover:text-[#aaaaaa] transition-colors"
            >
              Ver site →
            </Link>
          </div>
        </nav>

        <div className="px-5 py-5 border-t border-[#1f1f1f]">
          <p className="truncate text-[12px] text-[#444444]">
            {session.user.name || session.user.email}
          </p>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="mt-2 text-[12px] text-[#333333] hover:text-white transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-[40px_48px]">
        {children}
      </main>
    </div>
  );
}
