import type { Experience } from '@gleider-dev/shared';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

function formatPeriod(startDate: string, endDate: string | null, current: boolean): string {
  const start = formatDate(startDate);
  if (current) return `${start} - presente`;
  if (!endDate) return start;
  return `${start} - ${formatDate(endDate)}`;
}

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const isCurrent = experience.current;

  return (
    <div className="relative pl-8 pb-10 last:pb-0 group">
      {/* Timeline line */}
      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-gray-800 group-last:hidden" />

      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-2.5 h-[15px] w-[15px] rounded-full border-2 ${
          isCurrent
            ? 'border-emerald-500 bg-emerald-500/20'
            : 'border-gray-700 bg-gray-900'
        }`}
      />

      {/* Card */}
      <div
        className={`rounded-lg bg-gray-900 p-5 border-l-2 ${
          isCurrent ? 'border-emerald-500' : 'border-gray-700'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-white">{experience.role}</h3>
          {isCurrent && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              Atual
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-gray-400">{experience.company}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {formatPeriod(experience.startDate, experience.endDate, experience.current)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-300">{experience.description}</p>
      </div>
    </div>
  );
}
