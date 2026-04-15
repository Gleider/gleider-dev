import Link from 'next/link';
import { auth, signOut } from '../../auth';

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
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-gray-800 bg-gray-900 p-6 flex flex-col">
        <Link
          href="/admin"
          className="text-lg font-bold text-white hover:text-gray-300 transition-colors"
        >
          Admin
        </Link>
        <nav className="mt-8 flex flex-col gap-2">
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/projetos"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Projetos
          </Link>
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
          >
            Ver site
          </Link>
        </nav>
        <div className="mt-auto pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 truncate">
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
              className="mt-2 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
