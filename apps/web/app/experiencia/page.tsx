import type { Metadata } from 'next';
import { getExperiences } from '@/lib/api';
import { ExperienceTimeline } from '@/components/experience-timeline';

export const metadata: Metadata = {
  title: 'Experiência',
  description: 'Minha trajetória profissional e experiências de trabalho.',
  alternates: {
    canonical: '/experiencia',
  },
};

export default async function ExperienciaPage() {
  let experiences;

  try {
    experiences = await getExperiences();
  } catch {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white">Experiência</h1>
        <div className="mt-10 rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-gray-400">
            Não foi possível carregar as experiências no momento. Tente novamente mais tarde.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-white">Experiência</h1>
      <p className="mt-3 text-lg text-gray-400">Minha trajetória profissional.</p>

      <div className="mt-12">
        <ExperienceTimeline experiences={experiences} />
      </div>
    </section>
  );
}
