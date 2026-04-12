import Link from 'next/link';
import { ProjectType } from '@gleider-dev/shared';
import type { Project } from '@gleider-dev/shared';

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isExternal = project.type === ProjectType.EXTERNAL;
  const href = isExternal
    ? `https://${project.slug}.gleider.dev`
    : `/projetos/${project.slug}`;

  const badge = isExternal ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-950 px-2.5 py-0.5 text-xs font-medium text-blue-300">
      Externo
      <ExternalLinkIcon className="h-3 w-3" />
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-green-950 px-2.5 py-0.5 text-xs font-medium text-green-300">
      Interno
    </span>
  );

  const card = (
    <div className="flex h-full flex-col rounded-lg border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        {badge}
      </div>

      <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-400">
        {project.description}
      </p>

      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }

  return <Link href={href}>{card}</Link>;
}
