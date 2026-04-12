import type { Experience } from '@gleider-dev/shared';
import { ExperienceCard } from './experience-card';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="mx-auto max-w-2xl">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}
