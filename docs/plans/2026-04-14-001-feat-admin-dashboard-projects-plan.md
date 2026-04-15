---
title: "feat: Admin dashboard para gerenciar projetos"
type: feat
status: active
date: 2026-04-14
---

# feat: Admin dashboard para gerenciar projetos

## Overview

Adicionar um painel admin protegido por GitHub OAuth em `/admin/*` dentro do Next.js existente, com CRUD completo de projetos via API NestJS. Blog permanece como arquivos MDX sem alteracao. Experiencias, bio e demais conteudo permanecem gerenciados via codigo.

## Problem Frame

Hoje, para alterar projetos no site e necessario editar o arquivo `apps/api/prisma/seed.ts`, rodar o seed e fazer deploy. Isso e lento e propenso a erros. O admin permite criar, editar e excluir projetos pelo browser, com mudancas refletidas imediatamente no site.

## Requirements Trace

- R1. Autenticacao via GitHub OAuth, restrita ao usuario `GleiderM`
- R2. CRUD completo de projetos (criar, listar, editar, excluir) via admin
- R3. Endpoints GET da API permanecem publicos (sem breaking changes)
- R4. Endpoints de escrita (POST/PUT/DELETE) protegidos por JWT
- R5. Admin acessivel em `/admin/*` dentro do Next.js existente
- R6. Alteracoes em projetos refletem no site publico via ISR revalidation
- R7. Blog permanece como MDX, sem alteracoes

## Scope Boundaries

- Blog: sem alteracoes (MDX no filesystem)
- Experiencias: sem alteracoes (seed + API read-only)
- Bio, foto, links sociais: permanecem hardcoded no frontend
- Nao ha RBAC — unico usuario admin
- Nao ha upload de imagens — imageUrl continua como URL externa

## Context & Research

### Relevant Code and Patterns

- `apps/api/src/projects/projects.controller.ts` — controller existente (GET only), padrao a seguir para CRUD
- `apps/api/src/projects/projects.service.ts` — service com Prisma, padrao `findAll()` / `findBySlug()`
- `apps/api/src/prisma/prisma.module.ts` — PrismaModule `@Global()`, PrismaService com `onModuleInit`
- `apps/api/prisma/schema.prisma` — modelo Project (id uuid, name, slug unique, description, type enum, url?, imageUrl?, tags[], techStack[])
- `apps/web/lib/api.ts` — `fetchAPI<T>()` wrapper com ISR `revalidate: 60`
- `apps/web/app/projetos/page.tsx` — pagina publica de projetos, fetch com ISR
- `apps/web/components/nav.tsx` — unico client component, padrao a seguir
- `packages/shared/src/types/index.ts` — tipos `Project`, `Experience`, `ProjectType` enum

### External References

- Auth.js v5: JWT strategy com GitHub provider, `auth()` em server components, middleware para protecao de rotas
- NestJS: `@UseGuards()` por endpoint (nao global), `ValidationPipe` com `class-validator`, `PartialType` para update DTOs
- Token flow: Next.js assina JWT com `jose` (HS256) usando shared secret, NestJS valida com `passport-jwt`

## Key Technical Decisions

- **Auth.js v5 com JWT strategy (sem banco de sessoes)**: site pessoal single-user, nao precisa de sessoes persistidas. JWT auto-contido elimina infraestrutura extra
- **Shared secret (HS256) entre web e api**: ambos apps no mesmo deploy/infra, simetrico e mais simples que RS256
- **JWT separado para API (nao reusa cookie do Auth.js)**: Auth.js encripta o cookie com `AUTH_SECRET` — decodificar no NestJS criaria acoplamento. JWT separado assinado com `API_JWT_SECRET` mantem os apps desacoplados
- **Guard por endpoint (nao global)**: GET continua publico, so POST/PUT/DELETE protegidos. Evita quebrar o site publico
- **Server Actions para formularios admin**: integram com React transitions, progressive enhancement, e `revalidatePath` apos mutacoes
- **`jose` ao inves de `jsonwebtoken`**: funciona em Edge Runtime (middleware Next.js roda no Edge)
- **Next.js 15 middleware (nao proxy)**: projeto usa Next.js 15, `middleware.ts` e o padrao correto

## Open Questions

### Resolved During Planning

- **Onde fica o admin?** Dentro do Next.js em `/admin/*` (decisao do usuario)
- **Blog no admin?** Nao, permanece MDX (decisao do usuario)
- **Tipo de auth?** GitHub OAuth (decisao do usuario)

### Deferred to Implementation

- **Callback URL exata do GitHub OAuth App**: depende do dominio final (gleider.dev vs localhost)
- **Slug generation**: decidir se auto-gera do nome ou permite edicao manual — resolver ao implementar o form

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification.*

```
Browser (admin)
  |
  |-- Auth.js v5 (GitHub OAuth)
  |     |-- middleware.ts protege /admin/*
  |     |-- auth() em server components
  |
  |-- Server Action (form submit)
  |     |-- auth() verifica sessao
  |     |-- assina JWT com jose (API_JWT_SECRET)
  |     |-- fetch NestJS API com Bearer token
  |     |-- revalidatePath('/projetos')
  |
NestJS API
  |-- JwtAuthGuard (passport-jwt, API_JWT_SECRET)
  |     |-- GET /projects — publico (sem guard)
  |     |-- POST/PUT/DELETE /projects — protegido
  |
  |-- ProjectsService -> PrismaService -> PostgreSQL
```

## Implementation Units

- [ ] **Unit 1: Auth.js setup no Next.js**

**Goal:** Configurar GitHub OAuth com Auth.js v5, proteger rotas `/admin/*` via middleware

**Requirements:** R1, R5

**Dependencies:** Nenhuma

**Files:**
- Create: `apps/web/auth.ts`
- Create: `apps/web/middleware.ts`
- Create: `apps/web/app/api/auth/[...nextauth]/route.ts`
- Create: `apps/web/lib/api-server.ts`

**Approach:**
- Auth.js v5 com GitHub provider, JWT strategy (sem database adapter)
- Callback `signIn` restringe login ao username `GleiderM`
- Callback `jwt` adiciona `githubUsername` ao token
- Middleware exporta `auth` e aplica matcher `["/admin/:path*"]`
- `api-server.ts`: helper que assina JWT com `jose` (HS256, `API_JWT_SECRET`) e envia como Bearer token para o NestJS

**Patterns to follow:**
- `apps/web/lib/api.ts` — padrao de fetch wrapper existente

**Test scenarios:**
- Happy path: usuario GleiderM faz login via GitHub -> sessao criada, redirecionado para /admin
- Error path: usuario GitHub diferente de GleiderM tenta login -> rejeitado no callback signIn, sem sessao
- Error path: acesso a /admin/* sem sessao -> middleware redireciona para sign-in
- Happy path: server component em /admin chama `auth()` -> retorna sessao com githubUsername
- Happy path: `api-server.ts` gera JWT valido com claims sub, role e expiracao de 1h

**Verification:**
- Login com GitHub funciona e cria sessao
- /admin/* redireciona para login quando nao autenticado
- /admin/* acessivel quando autenticado como GleiderM

---

- [ ] **Unit 2: Auth module no NestJS**

**Goal:** Adicionar modulo de autenticacao JWT no NestJS para proteger endpoints de escrita

**Requirements:** R4

**Dependencies:** Unit 1 (precisa do shared secret definido)

**Files:**
- Create: `apps/api/src/auth/auth.module.ts`
- Create: `apps/api/src/auth/jwt.strategy.ts`
- Create: `apps/api/src/auth/jwt-auth.guard.ts`
- Modify: `apps/api/src/app.module.ts`
- Modify: `apps/api/src/main.ts`
- Test: `apps/api/src/auth/jwt-auth.guard.spec.ts`

**Approach:**
- `JwtStrategy` extends PassportStrategy, extrai token do header Authorization Bearer
- Valida com `API_JWT_SECRET` (shared com Next.js)
- `JwtAuthGuard` extends `AuthGuard('jwt')`
- Registrar `AuthModule` no `AppModule`
- Configurar CORS explicito em `main.ts` (origin do frontend)
- Adicionar `ValidationPipe` global com `whitelist: true` e `forbidNonWhitelisted: true`

**Patterns to follow:**
- `apps/api/src/prisma/prisma.module.ts` — padrao de module registration
- `apps/api/src/projects/projects.controller.spec.ts` — padrao de teste com mock providers

**Test scenarios:**
- Happy path: request com Bearer token valido -> guard permite acesso, `req.user` populado
- Error path: request sem token -> guard retorna 401 Unauthorized
- Error path: request com token expirado -> guard retorna 401
- Error path: request com token assinado com secret diferente -> guard retorna 401
- Edge case: request GET (sem guard) -> acesso normal sem token

**Verification:**
- Endpoints GET continuam acessiveis sem token
- Endpoints protegidos retornam 401 sem token valido
- Endpoints protegidos aceitam token assinado com API_JWT_SECRET

---

- [ ] **Unit 3: CRUD endpoints de projetos no NestJS**

**Goal:** Adicionar endpoints POST, PUT, DELETE para projetos, protegidos pelo JwtAuthGuard

**Requirements:** R2, R3, R4

**Dependencies:** Unit 2

**Files:**
- Create: `apps/api/src/projects/dto/create-project.dto.ts`
- Create: `apps/api/src/projects/dto/update-project.dto.ts`
- Modify: `apps/api/src/projects/projects.controller.ts`
- Modify: `apps/api/src/projects/projects.service.ts`
- Test: `apps/api/src/projects/projects.controller.spec.ts`

**Approach:**
- `CreateProjectDto` com class-validator: name (required), slug (required, unique), description (required), type (enum INTERNAL/EXTERNAL), url (optional), imageUrl (optional), tags (string[]), techStack (string[])
- `UpdateProjectDto` extends `PartialType(CreateProjectDto)`
- Service: `create(dto)`, `update(slug, dto)`, `remove(slug)` usando PrismaService
- Controller: `@UseGuards(JwtAuthGuard)` nos endpoints POST, PUT, DELETE
- Tratar erro Prisma P2002 (unique constraint violation no slug) com resposta 409 Conflict
- Tratar erro Prisma P2025 (record not found) com resposta 404

**Patterns to follow:**
- `apps/api/src/projects/projects.service.ts` — `findBySlug` com NotFoundException
- `apps/api/src/projects/projects.controller.ts` — padrao de injecao e decorators

**Test scenarios:**
- Happy path: POST /projects com dto valido e token -> projeto criado, retorna 201
- Happy path: PUT /projects/:slug com campos parciais e token -> projeto atualizado
- Happy path: DELETE /projects/:slug com token -> projeto removido
- Error path: POST /projects sem token -> 401
- Error path: POST /projects com slug duplicado -> 409 Conflict
- Error path: PUT /projects/:slug-inexistente -> 404 Not Found
- Error path: POST /projects com campos invalidos (name vazio) -> 400 Bad Request
- Edge case: GET /projects continua funcionando sem token (sem breaking change)
- Edge case: PUT /projects/:slug sem body -> nenhuma alteracao (PartialType permite vazio)

**Verification:**
- CRUD completo funcional via API
- GET endpoints inalterados e sem autenticacao
- Validacao rejeita payloads invalidos
- Erros de constraint retornam status HTTP adequados

---

- [ ] **Unit 4: Admin UI - layout, login e listagem de projetos**

**Goal:** Criar paginas admin com layout proprio, pagina de login e listagem de projetos

**Requirements:** R2, R5

**Dependencies:** Unit 1, Unit 3

**Files:**
- Create: `apps/web/app/admin/layout.tsx`
- Create: `apps/web/app/admin/page.tsx`
- Create: `apps/web/app/admin/login/page.tsx`
- Create: `apps/web/app/admin/projetos/page.tsx`
- Create: `apps/web/components/admin/project-form.tsx`
- Create: `apps/web/components/admin/project-table.tsx`

**Approach:**
- Layout admin: sidebar simples com links (Dashboard, Projetos), header com nome do usuario e botao de logout
- Mantém dark theme (bg-gray-950) consistente com o site publico
- `/admin` — dashboard com contagem de projetos
- `/admin/login` — botao "Entrar com GitHub" usando `signIn('github')`
- `/admin/projetos` — tabela com todos os projetos, botoes editar/excluir
- `project-table.tsx` — client component com listagem e acoes
- `project-form.tsx` — client component reutilizavel para criar/editar (campos: name, slug, description, type, url, imageUrl, tags, techStack)

**Patterns to follow:**
- `apps/web/components/nav.tsx` — padrao de client component com `'use client'`
- `apps/web/app/projetos/page.tsx` — padrao de fetch de projetos em server component
- Design system existente: cards `bg-gray-900 border-gray-800`, botoes `bg-white text-gray-950`

**Test scenarios:**
- Happy path: usuario autenticado acessa /admin -> ve dashboard com contagem de projetos
- Happy path: usuario acessa /admin/projetos -> ve tabela com todos os projetos
- Happy path: usuario clica "Excluir" -> projeto removido, lista atualizada
- Error path: usuario nao autenticado acessa /admin -> redirecionado para login
- Happy path: /admin/login -> botao GitHub OAuth, apos login redireciona para /admin
- Edge case: nenhum projeto cadastrado -> mensagem "Nenhum projeto encontrado"

**Verification:**
- Paginas admin renderizam corretamente com dark theme
- Navegacao entre paginas admin funciona
- Listagem mostra projetos do banco
- Login/logout funcional

---

- [ ] **Unit 5: Admin UI - criar e editar projetos**

**Goal:** Formularios para criar e editar projetos com Server Actions

**Requirements:** R2, R6

**Dependencies:** Unit 4

**Files:**
- Create: `apps/web/app/admin/projetos/novo/page.tsx`
- Create: `apps/web/app/admin/projetos/[slug]/editar/page.tsx`
- Create: `apps/web/app/actions/projects.ts`
- Modify: `apps/web/components/admin/project-form.tsx`

**Approach:**
- `/admin/projetos/novo` — pagina com ProjectForm vazio
- `/admin/projetos/[slug]/editar` — pagina com ProjectForm preenchido com dados do projeto
- `app/actions/projects.ts` — Server Actions: `createProject`, `updateProject`, `deleteProject`
  - Cada action chama `auth()` para verificar sessao
  - Assina JWT e faz fetch para API NestJS
  - Chama `revalidatePath('/projetos')` e `revalidatePath('/admin/projetos')` apos mutacao
  - Redireciona para `/admin/projetos` apos sucesso
- ProjectForm: campos com validacao client-side basica, submit via Server Action
- Tags e techStack como inputs de texto separados por virgula (UX simples)

**Patterns to follow:**
- `apps/web/lib/api.ts` — padrao de fetch para API
- `apps/web/app/projetos/page.tsx` — padrao de server component com fetch

**Test scenarios:**
- Happy path: preencher form e submeter -> projeto criado, redirecionado para lista, projeto aparece
- Happy path: editar projeto existente -> campos preenchidos, alterar nome, submeter -> projeto atualizado
- Error path: submeter form com campos obrigatorios vazios -> mensagem de erro no form
- Error path: submeter com slug duplicado -> mensagem de erro "Projeto ja existe"
- Happy path: apos criar projeto, pagina publica /projetos mostra o novo projeto (ISR revalidation)
- Edge case: editar projeto e mudar o slug -> projeto acessivel pelo novo slug
- Integration: Server Action verifica auth -> assina JWT -> chama API -> revalida cache -> redireciona

**Verification:**
- Criar projeto pelo admin e verificar que aparece no site publico
- Editar projeto e verificar alteracao no site publico
- Excluir projeto e verificar remocao do site publico
- Formularios mostram erros de validacao adequados

---

- [ ] **Unit 6: Deploy - variaveis de ambiente e GitHub OAuth App**

**Goal:** Configurar variaveis de ambiente em producao e criar GitHub OAuth App

**Requirements:** R1

**Dependencies:** Units 1-5

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify: docker-compose.yml no EC2 (via SSH)

**Approach:**
- Criar GitHub OAuth App em github.com/settings/developers:
  - Homepage URL: `https://gleider.dev`
  - Callback URL: `https://gleider.dev/api/auth/callback/github`
- Gerar `AUTH_SECRET` com `npx auth secret`
- Gerar `API_JWT_SECRET` com `openssl rand -base64 32`
- Adicionar secrets no GitHub Actions: `AUTH_SECRET`, `API_JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Atualizar docker-compose.yml no EC2 com as novas env vars nos containers web e api
- Configurar CORS na API para aceitar `https://gleider.dev`

**Test expectation: none -- configuracao de infraestrutura, verificacao manual via smoke test**

**Verification:**
- Login com GitHub funciona em producao (gleider.dev/admin)
- API aceita tokens JWT do frontend em producao
- Site publico continua funcionando normalmente

## System-Wide Impact

- **Interaction graph:** Auth.js middleware intercepta todas as requests `/admin/*`. Server Actions chamam `auth()` + API NestJS. JwtAuthGuard intercepta POST/PUT/DELETE na API. `revalidatePath` invalida cache ISR apos mutacoes.
- **Error propagation:** Erros de auth (401) sao tratados pelo NestJS guard e retornados ao Server Action, que mostra mensagem no form. Erros Prisma (P2002, P2025) mapeados para HTTP 409/404.
- **State lifecycle risks:** Revalidacao ISR pode ter delay de ate 60s para propagacao no site publico. CloudFront cache pode adicionar delay extra (mitigado pela invalidacao no deploy).
- **API surface parity:** GET endpoints permanecem identicos — nenhuma alteracao no contrato publico da API.
- **Unchanged invariants:** Todas as paginas publicas (/, /blog, /projetos, /experiencia) continuam funcionando sem autenticacao. O modelo Project no Prisma nao muda de schema.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| GitHub OAuth callback URL errada em producao | Testar com URL de producao antes de marcar como concluido |
| Token JWT expira durante sessao de edicao longa | Expiracao de 1h e suficiente; sessao Auth.js dura 30 dias |
| ISR cache desatualizado apos mutacao | `revalidatePath` chamado em toda Server Action |
| CORS bloqueia requests do admin para API | Configurar `WEB_URL` explicito no NestJS |

## Sources & References

- Auth.js v5: https://authjs.dev/getting-started
- NestJS Guards: https://docs.nestjs.com/guards
- NestJS Validation: https://docs.nestjs.com/techniques/validation
- Next.js Server Actions: https://nextjs.org/docs/app/getting-started/mutating-data
- Prisma CRUD: https://www.prisma.io/docs/orm/prisma-client
