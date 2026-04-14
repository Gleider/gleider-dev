import { PrismaClient, ProjectType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();

  // Seed projects
  await prisma.project.createMany({
    data: [
      {
        name: 'gleider.dev',
        slug: 'gleider-dev',
        description:
          'Site pessoal com blog, portfólio de projetos e experiência profissional. Construído com Next.js, NestJS e Terraform na AWS.',
        type: ProjectType.INTERNAL,
        url: null,
        imageUrl: null,
        tags: ['pessoal', 'portfólio', 'blog'],
        techStack: ['Next.js', 'NestJS', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Terraform', 'AWS'],
      },
      {
        name: 'Unieloo',
        slug: 'unieloo',
        description:
          'Startup de Health Tech que conectava estudantes com profissionais da área da saúde por preços acessíveis. Mais de 1000 clientes. Incubada pela Conectar (UFPel).',
        type: ProjectType.INTERNAL,
        url: null,
        imageUrl: null,
        tags: ['startup', 'health-tech', 'saúde'],
        techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      },
      {
        name: 'Letreco',
        slug: 'letreco',
        description:
          'Jogo de palavras inspirado no Wordle, adaptado para o português brasileiro.',
        type: ProjectType.EXTERNAL,
        url: 'https://letreco.gleider.dev',
        imageUrl: null,
        tags: ['jogo', 'open-source', 'português'],
        techStack: ['React', 'TypeScript'],
      },
    ],
  });

  // Seed experiences
  await prisma.experience.createMany({
    data: [
      {
        company: 'Twism',
        role: 'Software Engineer',
        description:
          'Desenvolvimento backend em fintech de fidelidade e moedas digitais personalizadas. Arquitetura de serviços backend, analytics de produto com Mixpanel e monitoramento de performance com Datadog. Stack: NestJS, MySQL e serviços AWS.',
        startDate: new Date('2022-07-01'),
        endDate: null,
        current: true,
      },
      {
        company: 'Mouts TI',
        role: 'Back-end Developer',
        description:
          'Desenvolvimento backend para Engie em intermédio pela Mouts. Microsserviços com NodeJS, Docker, Kubernetes e banco de dados Oracle.',
        startDate: new Date('2022-02-01'),
        endDate: new Date('2022-07-01'),
        current: false,
      },
      {
        company: 'Nave.rs',
        role: 'Desenvolvedor Back-end / Tech Lead',
        description:
          'Início como desenvolvedor back-end, evoluindo para full stack e tech lead. Trabalhei com Node.JS, React, Elixir, arquitetura de microsserviços, PostgreSQL e serviços AWS (EC2, S3, Route53, Textract).',
        startDate: new Date('2020-08-01'),
        endDate: new Date('2022-02-01'),
        current: false,
      },
      {
        company: 'Unieloo',
        role: 'Co-fundador / Gerente de Tecnologia',
        description:
          'Sócio fundador de startup Health Tech que conectava estudantes com profissionais da saúde. Mais de 1000 clientes. Responsável por grande parte do desenvolvimento (React, NodeJS, PostgreSQL). Incubados pela Conectar (UFPel), participação em rodas de investimento.',
        startDate: new Date('2019-02-01'),
        endDate: new Date('2020-08-01'),
        current: false,
      },
      {
        company: 'Freedom Veículos Elétricos',
        role: 'Estagiário',
        description:
          'Desenvolvimento em Ruby on Rails, Angular e PostgreSQL. Aplicação para gerenciamento de montagem de cadeiras de rodas.',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2019-02-01'),
        current: false,
      },
    ],
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
