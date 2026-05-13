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
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <aside
        className="flex flex-col flex-shrink-0"
        style={{
          width: '240px',
          backgroundColor: '#111111',
          borderRight: '1px solid #1f1f1f',
        }}
      >
        <div
          className="px-5 py-6"
          style={{ borderBottom: '1px solid #1f1f1f' }}
        >
          <Link href="/admin">
            <span
              className="block font-bold"
              style={{ fontSize: '15px', color: '#ffffff', letterSpacing: '-0.02em' }}
            >
              gleider.dev
            </span>
            <span
              className="block font-semibold uppercase"
              style={{ fontSize: '10px', color: '#444444', letterSpacing: '0.1em', marginTop: '2px' }}
            >
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
          <span
            className="block px-2 font-semibold uppercase"
            style={{ fontSize: '10px', color: '#333333', letterSpacing: '0.1em', marginBottom: '6px' }}
          >
            Site
          </span>
          <SidebarNav
            items={[
              { href: '/admin', label: 'Dashboard', exact: true },
              { href: '/admin/projetos', label: 'Projetos' },
            ]}
          />

          <span
            className="block px-2 font-semibold uppercase"
            style={{ fontSize: '10px', color: '#333333', letterSpacing: '0.1em', marginBottom: '6px', marginTop: '16px' }}
          >
            Projetos
          </span>
          <SidebarNav
            items={[
              { href: '/admin/letreco', label: 'Letreco' },
              { href: '/admin/zelar', label: 'Zelar' },
            ]}
          />

          <div style={{ marginTop: '16px' }}>
            <Link
              href="/"
              className="block px-2 py-1.5 rounded-md transition-colors"
              style={{ fontSize: '13px', color: '#444444' }}
            >
              Ver site →
            </Link>
          </div>
        </nav>

        <div
          className="px-5 py-5"
          style={{ borderTop: '1px solid #1f1f1f' }}
        >
          <p
            className="truncate"
            style={{ fontSize: '12px', color: '#444444' }}
          >
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
              className="mt-2 transition-colors hover:text-white"
              style={{ fontSize: '12px', color: '#333333' }}
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto" style={{ padding: '40px 48px' }}>
        {children}
      </main>
    </div>
  );
}
