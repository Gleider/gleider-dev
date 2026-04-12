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
          'Site pessoal com blog, portfólio de projetos e experiência profissional.',
        type: ProjectType.INTERNAL,
        url: null,
        imageUrl: null,
        tags: ['pessoal', 'portfolio', 'blog'],
        techStack: ['Next.js', 'NestJS', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      },
      {
        name: 'DevTools Dashboard',
        slug: 'devtools-dashboard',
        description:
          'Dashboard interno para monitoramento de ferramentas de desenvolvimento.',
        type: ProjectType.INTERNAL,
        url: null,
        imageUrl: null,
        tags: ['dashboard', 'monitoramento', 'devtools'],
        techStack: ['React', 'Node.js', 'Redis', 'Docker'],
      },
      {
        name: 'API Gateway',
        slug: 'api-gateway',
        description:
          'API Gateway centralizado para gerenciar microsserviços com rate limiting e autenticação.',
        type: ProjectType.EXTERNAL,
        url: 'https://gateway.gleider.dev',
        imageUrl: null,
        tags: ['api', 'microsserviços', 'gateway'],
        techStack: ['Go', 'Redis', 'Docker', 'Kubernetes'],
      },
      {
        name: 'Open Source CLI',
        slug: 'open-source-cli',
        description:
          'Ferramenta CLI open source para automação de tarefas comuns de desenvolvimento.',
        type: ProjectType.EXTERNAL,
        url: 'https://cli.gleider.dev',
        imageUrl: null,
        tags: ['cli', 'open-source', 'automação'],
        techStack: ['Rust', 'GitHub Actions'],
      },
    ],
  });

  // Seed experiences
  await prisma.experience.createMany({
    data: [
      {
        company: 'TechCorp Brasil',
        role: 'Senior Software Engineer',
        description:
          'Liderança técnica de squad, desenvolvimento de microsserviços e mentoria de desenvolvedores.',
        startDate: new Date('2023-06-01'),
        endDate: null,
        current: true,
      },
      {
        company: 'StartupXYZ',
        role: 'Full Stack Developer',
        description:
          'Desenvolvimento full stack de plataforma SaaS com React, Node.js e PostgreSQL.',
        startDate: new Date('2021-03-01'),
        endDate: new Date('2023-05-31'),
        current: false,
      },
      {
        company: 'Agência Digital',
        role: 'Junior Developer',
        description:
          'Desenvolvimento de aplicações web e APIs REST para clientes variados.',
        startDate: new Date('2019-08-01'),
        endDate: new Date('2021-02-28'),
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
