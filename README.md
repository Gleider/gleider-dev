# gleider.dev

Site pessoal de [Gleider Mackedanz](https://gleider.dev) — blog, projetos e experiência profissional.

## Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS 4 + MDX
- **Backend:** NestJS 11 + Prisma ORM + PostgreSQL
- **Infra:** Terraform (AWS: EC2, RDS, CloudFront, Route53)
- **CI/CD:** GitHub Actions
- **Monorepo:** Turborepo + pnpm workspaces

## Estrutura

```
apps/web/        Next.js frontend (porta 3000)
apps/api/        NestJS backend (porta 3001)
packages/shared  Tipos TypeScript compartilhados
infra/           Módulos Terraform (networking, database, compute, cdn, dns)
.github/         Workflows CI/CD
```

## Desenvolvimento local

**Pré-requisitos:** Node.js 20+, pnpm, Docker

```bash
# Instalar dependências
pnpm install

# Subir PostgreSQL local
docker-compose up -d

# Rodar migrations e seed
pnpm db:migrate
pnpm db:seed

# Iniciar dev server
pnpm dev
```

O frontend roda em `http://localhost:3000` e a API em `http://localhost:3001`.

### Comandos úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia web e api em modo desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm lint` | Linting |
| `pnpm db:migrate` | Roda migrations do Prisma |
| `pnpm db:seed` | Popula o banco com dados iniciais |
| `pnpm db:studio` | Abre o Prisma Studio |
| `pnpm db:reset` | Reseta o banco (apaga dados + re-seed) |

## Deploy

A infraestrutura é gerenciada via Terraform na AWS (us-east-2):

- **EC2 t3.micro** roda os containers Docker (web + api) com Nginx como reverse proxy
- **RDS PostgreSQL** (db.t3.micro) para o banco de dados
- **CloudFront** como CDN e terminação SSL
- **Route53** para DNS com certificado wildcard `*.gleider.dev`

```bash
cd infra
terraform init
terraform plan
terraform apply
```

## Licença

Uso pessoal.
