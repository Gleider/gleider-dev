import { apiServerGet } from '../../lib/api-server';
import type { Project } from '@gleider-dev/shared';
import Link from 'next/link';

export default async function AdminDashboard() {
  const projects = await apiServerGet<Project[]>('/projects');

  return (
    <div>
      <h1 className="font-extrabold text-[42px] text-white tracking-[-0.03em] leading-none">
        Dashboard
      </h1>
      <p className="mt-2 text-[14px] text-[#444444]">Visão geral do site</p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/projetos"
          className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-[20px_24px] hover:border-[#2f2f2f] transition-colors"
        >
          <p className="font-extrabold text-[34px] text-white tracking-[-0.03em] leading-none">
            {projects.length}
          </p>
          <p className="mt-2 font-semibold uppercase text-[11px] text-[#444444] tracking-[0.08em]">
            Projetos
          </p>
        </Link>

        <Link
          href="/admin/letreco"
          className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-[20px_24px] hover:border-[#2f2f2f] transition-colors"
        >
          <p className="font-extrabold text-[34px] text-[#4f7fff] tracking-[-0.03em] leading-none">
            →
          </p>
          <p className="mt-2 font-semibold uppercase text-[11px] text-[#444444] tracking-[0.08em]">
            Letreco
          </p>
        </Link>

        <Link
          href="/admin/zelar"
          className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-[20px_24px] hover:border-[#2f2f2f] transition-colors"
        >
          <p className="font-extrabold text-[34px] text-[#f59e0b] tracking-[-0.03em] leading-none">
            →
          </p>
          <p className="mt-2 font-semibold uppercase text-[11px] text-[#444444] tracking-[0.08em]">
            Zelar
          </p>
        </Link>
      </div>
    </div>
  );
}
