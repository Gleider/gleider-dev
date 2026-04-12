# gleider.dev

Site pessoal de Gleider em gleider.dev — blog, portfólio de projetos e experiência profissional.

## Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS 4 + MDX para blog
- **Backend:** NestJS 11 + Prisma ORM + PostgreSQL
- **Infra:** Terraform (AWS: ECS Fargate, RDS, CloudFront, Route53)
- **CI/CD:** GitHub Actions
- **Monorepo:** Turborepo + pnpm workspaces

## Estrutura

```
apps/web/       → Next.js frontend (porta 3000)
apps/api/       → NestJS backend (porta 3001)
packages/shared → Tipos TypeScript compartilhados (Project, Experience)
infra/          → Módulos Terraform (networking, database, ecs, cdn, dns)
.github/        → Workflows CI/CD
```

## Como rodar

```bash
pnpm install
docker-compose up -d        # PostgreSQL
pnpm --filter @gleider-dev/api exec prisma migrate dev
pnpm --filter @gleider-dev/api exec prisma db seed
pnpm dev                    # Sobe web (3000) e api (3001)
```

## Convenções

- **Dark theme** como padrão (bg-gray-950, texto claro) — sem toggle light/dark
- **Blog** via arquivos MDX em `apps/web/content/blog/` com frontmatter YAML
- **Projetos** com tipo `INTERNAL` (rota interna `/projetos/[slug]`) ou `EXTERNAL` (link para subdomínio `*.gleider.dev`)
- **Português** como idioma principal do conteúdo
- Conventional commits: `feat(scope):`, `fix(scope):`, `refactor(scope):`

## Plano de implementação

Referência completa: `docs/plans/2026-04-12-001-feat-gleider-dev-personal-site-plan.md`
