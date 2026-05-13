import Link from 'next/link';
import { getZelarStats, getRecentZelarUsers } from '../../../lib/zelar-db';

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default async function ZelarAdminPage() {
  let stats = null;
  let users = null;
  let error = null;

  try {
    [stats, users] = await Promise.all([getZelarStats(), getRecentZelarUsers()]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Erro ao conectar ao banco Zelar';
  }

  if (error) {
    return (
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-[12px]">
          <Link href="/admin" className="text-[#444444] hover:text-white transition-colors">Admin</Link>
          <span className="text-[#333333]" aria-hidden="true">/</span>
          <span className="text-white" aria-current="page">Zelar</span>
        </nav>
        <h1 className="font-extrabold text-[42px] text-white tracking-[-0.03em] leading-none">
          Zelar
        </h1>
        <div className="mt-8 rounded-xl border border-[#3f1515] bg-[#1a0a0a] p-6">
          <p className="text-[13px] text-[#f87171]">
            Não foi possível conectar ao banco Zelar: <code>{error}</code>
          </p>
          <p className="mt-2 text-[12px] text-[#555555]">
            Configure a variável de ambiente <code>DATABASE_URL_ZELAR</code>.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Usuários', value: stats!.totalUsers.toLocaleString('pt-BR'), colorClass: 'text-white', sub: 'total cadastrados' },
    { label: 'Novos (7d)', value: `+${stats!.newUsersLast7Days}`, colorClass: 'text-[#4f7fff]', sub: 'últimos 7 dias' },
    { label: 'Casas', value: stats!.totalHouseholds.toLocaleString('pt-BR'), colorClass: 'text-white', sub: 'households ativos' },
    { label: 'Plano PRO', value: stats!.proHouseholds.toLocaleString('pt-BR'), colorClass: 'text-[#f59e0b]', sub: 'casas com PRO' },
    { label: 'Tarefas', value: stats!.totalTasks.toLocaleString('pt-BR'), colorClass: 'text-white', sub: 'criadas no total' },
  ];

  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-[12px]">
        <Link href="/admin" className="text-[#444444] hover:text-white transition-colors">Admin</Link>
        <span className="text-[#333333]" aria-hidden="true">/</span>
        <span className="text-white" aria-current="page">Zelar</span>
      </nav>

      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="font-extrabold text-[42px] text-white tracking-[-0.03em] leading-none">
            Zelar
          </h1>
          <p className="mt-2 text-[14px] text-[#444444]">Visão geral do produto</p>
        </div>
        <span className="font-mono text-[11px] text-[#333333]">atualizado agora</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#1f1f1f] bg-[#111111] py-5 px-6">
            <p className="font-semibold uppercase text-[11px] text-[#444444] tracking-[0.08em] mb-2.5">
              {card.label}
            </p>
            <p className={`font-extrabold text-[34px] tracking-[-0.03em] leading-none ${card.colorClass}`}>
              {card.value}
            </p>
            <p className="mt-2 text-[11px] text-[#333333]">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-[#1f1f1f] bg-[#111111] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f1f1f]">
          <span className="text-[13px] font-semibold text-white">Usuários recentes</span>
          <span className="text-[11px] text-[#444444]">20 mais recentes · ordenado por cadastro</span>
        </div>

        {/* Table header */}
        <div className="flex items-center px-6 py-2.5 border-b border-[#1a1a1a]">
          <div className="w-[200px] shrink-0 text-[10px] font-semibold uppercase text-[#333333] tracking-[0.08em]">Nome</div>
          <div className="flex-1 text-[10px] font-semibold uppercase text-[#333333] tracking-[0.08em]">Email</div>
          <div className="w-[120px] shrink-0 text-[10px] font-semibold uppercase text-[#333333] tracking-[0.08em]">Cadastro</div>
          <div className="w-[160px] shrink-0 text-[10px] font-semibold uppercase text-[#333333] tracking-[0.08em]">Casa</div>
          <div className="w-[80px] shrink-0 text-[10px] font-semibold uppercase text-[#333333] tracking-[0.08em]">Plano</div>
        </div>

        {/* Table rows */}
        {users!.map((user, i) => {
          const isDeleted = user.deletedAt !== null;
          return (
            <div
              key={`${user.email}-${i}`}
              className={`flex items-center px-6 py-3.5 border-b border-[#161616] ${isDeleted ? 'opacity-40' : ''}`}
            >
              <div className={`w-[200px] shrink-0 text-[13px] font-medium text-[#e5e5e5] ${isDeleted ? 'line-through' : ''}`}>
                {user.name}
              </div>
              <div className={`flex-1 font-mono text-[12px] text-[#666666] ${isDeleted ? 'line-through' : ''}`}>
                {user.email}
              </div>
              <div className="w-[120px] shrink-0 text-[12px] text-[#555555]">
                {formatDate(user.createdAt)}
              </div>
              <div className={`w-[160px] shrink-0 text-[12px] ${user.householdName ? 'text-[#aaaaaa]' : 'text-[#444444]'}`}>
                {user.householdName ?? '—'}
              </div>
              <div className="w-[80px] shrink-0">
                {user.planName === 'PRO' ? (
                  <span className="inline-block px-2 py-0.5 bg-[#f59e0b]/10 rounded text-[11px] font-semibold text-[#f59e0b] tracking-[0.04em]">
                    PRO
                  </span>
                ) : user.planName === 'FREE' ? (
                  <span className="inline-block px-2 py-0.5 bg-[#646464]/10 rounded text-[11px] font-semibold text-[#555555] tracking-[0.04em]">
                    FREE
                  </span>
                ) : (
                  <span className="text-[12px] text-[#333333]">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
