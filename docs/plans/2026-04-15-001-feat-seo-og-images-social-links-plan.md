---
title: "feat: Adicionar SEO completo, OG images dinâmicas e links sociais"
type: feat
status: active
date: 2026-04-15
deepened: 2026-04-15
---

# feat: Adicionar SEO completo, OG images dinâmicas e links sociais

## Overview

Melhorar a presença do site gleider.dev em buscadores e redes sociais adicionando meta tags completas, geração dinâmica de Open Graph images para blog posts e projetos, sitemap, robots.txt, favicon, e expandir os links sociais no footer com Instagram, WhatsApp e email.

## Problem Frame

Atualmente o site tem meta tags básicas (título, descrição, OG mínimo) mas quando compartilhado no LinkedIn, WhatsApp ou Twitter os links aparecem sem imagem preview e com metadados incompletos. O footer só tem GitHub e LinkedIn, faltando canais de contato importantes. Não existe sitemap para indexação, nem favicon, nem Twitter cards.

## Requirements Trace

- R1. Cada página deve ter meta tags OG completas (title, description, image, url)
- R2. Blog posts e projetos devem gerar OG images dinâmicas com título e branding
- R3. Twitter/X cards devem funcionar com `summary_large_image`
- R4. Footer deve incluir Instagram, WhatsApp e email além de GitHub e LinkedIn
- R5. Site deve ter sitemap.xml gerado automaticamente
- R6. Site deve ter robots.txt adequado
- R7. Site deve ter favicon e apple-touch-icon
- R8. URLs canônicas devem estar definidas por página

## Scope Boundaries

- Sem structured data (JSON-LD) nesta iteração
- Sem PWA manifest
- Sem campo `image` no frontmatter de blog posts (OG image é gerada a partir do título/summary)
- Sem dark mode toggle (mantém dark theme fixo)

## Context & Research

### Relevant Code and Patterns

- `apps/web/app/layout.tsx` — já exporta `metadata` com OG básico e `metadataBase`
- `apps/web/app/blog/[slug]/page.tsx` — já usa `generateMetadata` com title/description
- `apps/web/app/projetos/[slug]/page.tsx` — já usa `generateMetadata` com title/description
- `apps/web/components/footer.tsx` — SVG inline icons para GitHub e LinkedIn com `text-gray-500 hover:text-white`
- Next.js 15 App Router metadata API já em uso correto pelo projeto

### External References

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js OG Image Generation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)

## Key Technical Decisions

- **OG images via `next/og` (ImageResponse)**: Usar a API nativa do Next.js para gerar imagens dinâmicas em runtime. Cada rota terá um `opengraph-image.tsx` que renderiza JSX como imagem. Evita dependências externas e se integra naturalmente com o App Router.
- **Design das OG images**: Fundo escuro (consistente com o tema do site), título em destaque, branding "gleider.dev", cores que combinem com o dark theme atual.
- **WhatsApp como link direto**: Usar `https://wa.me/NUMERO` (sem mensagem pré-definida) como link no footer.
- **Email como `mailto:`**: Link direto para o email de contato.

## Open Questions

### Resolved During Planning

- **Geração estática vs dinâmica de OG images?** Dinâmica via `next/og` — gera imagens únicas para cada post/projeto automaticamente.
- **Quais redes sociais adicionar?** Instagram, WhatsApp e email (além de GitHub e LinkedIn existentes).

### Deferred to Implementation

- **Número exato do WhatsApp e username do Instagram**: Serão configurados durante implementação (podem ser hardcoded inicialmente ou via env vars).
- **Fonte exata para OG images**: A fonte padrão do `next/og` (Satori) pode ser customizada se necessário durante implementação.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
Hierarquia de metadata (App Router):
  layout.tsx (root)
    ├── metadata global: title template, OG defaults, twitter card config
    ├── opengraph-image.tsx (default OG image para páginas sem override)
    │
    ├── /blog/[slug]/
    │   ├── generateMetadata() → title, description, article type, publishedTime, tags
    │   └── opengraph-image.tsx → imagem dinâmica com título do post
    │
    ├── /projetos/[slug]/
    │   ├── generateMetadata() → title, description, project-specific OG
    │   └── opengraph-image.tsx → imagem dinâmica com nome do projeto
    │
    ├── sitemap.ts → rotas estáticas + blog posts + projetos INTERNAL (API best-effort)
    └── robots.ts → allow all, referencia sitemap

Footer social links:
  GitHub | LinkedIn | Instagram | WhatsApp | Email
  (SVG icons inline, mesmo padrão visual existente)
```

## Implementation Units

- [ ] **Unit 1: Metadata raiz, favicon e Twitter cards**

**Goal:** Completar os metadados globais do site com Twitter cards, autoria, favicon e canonical URL.

**Requirements:** R1, R3, R7, R8

**Dependencies:** Nenhuma

**Files:**
- Modify: `apps/web/app/layout.tsx`
- Modify: `apps/web/app/blog/page.tsx`
- Modify: `apps/web/app/projetos/page.tsx`
- Modify: `apps/web/app/experiencia/page.tsx`
- Create: `apps/web/app/favicon.ico`
- Create: `apps/web/app/icon.png` (ou `icon.svg`)
- Create: `apps/web/app/apple-icon.png`

**Approach:**
- Expandir o objeto `metadata` no layout raiz adicionando `twitter` (card, creator), `authors`, `creator`, `alternates.canonical`
- Adicionar `alternates.canonical` também nas listing pages (`/blog`, `/projetos`, `/experiencia`) que já exportam `metadata` estática
- Adicionar favicon e apple-touch-icon usando as convenções de arquivo do App Router
- O favicon pode ser gerado a partir de um design simples com as iniciais "G" ou "gd"

**Patterns to follow:**
- Padrão existente de `metadata` em `apps/web/app/layout.tsx`

**Test scenarios:**
- Happy path: Build do Next.js deve completar sem erros com os novos metadados
- Happy path: HTML renderizado da homepage deve conter `<meta name="twitter:card" content="summary_large_image">`
- Happy path: Requisição a `/favicon.ico` deve retornar imagem válida
- Happy path: Requisição a `/apple-icon.png` deve retornar imagem válida
- Happy path: Listing pages (`/blog`, `/projetos`, `/experiencia`) devem ter `<link rel="canonical">` no HTML
- Edge case: Páginas filhas devem herdar twitter config do layout raiz quando não fazem override

**Verification:**
- Inspecionar HTML da homepage e verificar presença de twitter card meta tags, canonical URL e link para favicon

---

- [ ] **Unit 2: OG image padrão do site**

**Goal:** Criar uma imagem Open Graph padrão que será usada por todas as páginas que não definem a própria.

**Requirements:** R1, R2

**Dependencies:** Unit 1

**Files:**
- Create: `apps/web/app/opengraph-image.tsx`

**Approach:**
- Usar `ImageResponse` do `next/og` para gerar uma imagem 1200x630 com:
  - Fundo escuro (tons de gray-950 do tema do site)
  - Nome "gleider.dev" em destaque
  - Subtítulo com a descrição do site
  - Estilo visual consistente com o dark theme
- Exportar `size`, `contentType` e `alt` conforme convenção do App Router

**Patterns to follow:**
- Convenção Next.js App Router para `opengraph-image.tsx`

**Test scenarios:**
- Happy path: Acessar `/opengraph-image` deve retornar imagem PNG 1200x630
- Happy path: Meta tag `og:image` no HTML da homepage deve apontar para a URL da imagem gerada
- Edge case: Imagem deve ser legível em thumbnails pequenos (~300px de largura)

**Verification:**
- Acessar a rota da OG image no browser e verificar que renderiza corretamente

---

- [ ] **Unit 3: OG image dinâmica para blog posts**

**Goal:** Gerar OG images únicas para cada blog post com título e tags, e enriquecer os metadados de artigo.

**Requirements:** R1, R2, R3, R8

**Dependencies:** Unit 1 (metadata raiz deve estar configurada)

**Files:**
- Create: `apps/web/app/blog/[slug]/opengraph-image.tsx`
- Modify: `apps/web/app/blog/[slug]/page.tsx`

**Approach:**
- Criar `opengraph-image.tsx` que lê o frontmatter do post via `getPostBySlug` e renderiza imagem com:
  - Título do post em destaque
  - Branding "gleider.dev" discreto
  - Mesmo estilo visual da OG image padrão
- O `opengraph-image.tsx` é um route handler independente — deve chamar `getPostBySlug` diretamente, não reutiliza dados de `page.tsx`
- Enriquecer `generateMetadata` em `page.tsx` para incluir:
  - `openGraph.type: 'article'`
  - `openGraph.publishedTime`
  - `openGraph.tags`
  - `openGraph.url`
  - `alternates.canonical`

**Patterns to follow:**
- `getPostBySlug` já usado em `apps/web/app/blog/[slug]/page.tsx`
- Padrão de `generateMetadata` existente no mesmo arquivo

**Test scenarios:**
- Happy path: Acessar `/blog/hello-world/opengraph-image` deve retornar imagem com o título "Bem-vindo ao meu blog"
- Happy path: Meta tag `og:type` do post deve ser `article` com `article:published_time`
- Happy path: `og:image` do post deve apontar para a OG image específica do post, não a padrão
- Edge case: Post com título muito longo deve truncar ou reduzir fonte sem quebrar layout da imagem
- Error path: Slug inexistente no `opengraph-image.tsx` deve retornar a imagem padrão ou 404 gracefully
- Error path: Post com `published: false` deve ser tratado como inexistente (mesma resposta de slug inválido)

**Verification:**
- Compartilhar URL de um post no validador do LinkedIn/Twitter e ver preview com imagem e metadados corretos

---

- [ ] **Unit 4: OG image dinâmica para projetos**

**Goal:** Gerar OG images únicas para cada projeto com nome e tech stack.

**Requirements:** R1, R2, R3, R8

**Dependencies:** Unit 1 (metadata raiz deve estar configurada)

**Files:**
- Create: `apps/web/app/projetos/[slug]/opengraph-image.tsx`
- Modify: `apps/web/app/projetos/[slug]/page.tsx`

**Approach:**
- Criar `opengraph-image.tsx` que busca o projeto via API e renderiza imagem com:
  - Nome do projeto em destaque
  - Tech stack como badges/tags
  - Branding "gleider.dev"
- O `opengraph-image.tsx` é um route handler independente — deve chamar `getProject` diretamente
- Projetos com `type === EXTERNAL` devem retornar 404 no OG image (consistente com `page.tsx` que chama `notFound()` para EXTERNAL)
- Enriquecer `generateMetadata` para incluir:
  - `openGraph.url`
  - `alternates.canonical`

**Patterns to follow:**
- `getProject` já usado em `apps/web/app/projetos/[slug]/page.tsx`
- Mesmo design visual das OG images do blog

**Test scenarios:**
- Happy path: Acessar `/projetos/SLUG/opengraph-image` deve retornar imagem com nome do projeto (INTERNAL)
- Happy path: `og:image` do projeto deve apontar para a OG image específica
- Edge case: Projeto com muitas techs no stack deve mostrar apenas as primeiras sem overflow
- Edge case: Projeto EXTERNAL deve retornar 404 no OG image (consistente com a página que faz notFound)
- Error path: Slug inexistente deve retornar fallback ou 404 sem crash

**Verification:**
- Acessar URL da OG image no browser e verificar renderização

---

- [ ] **Unit 5: Links sociais no footer**

**Goal:** Adicionar Instagram, WhatsApp e email ao footer, mantendo o estilo visual existente.

**Requirements:** R4

**Dependencies:** Nenhuma (pode ser implementado em paralelo com Units 1-4)

**Files:**
- Modify: `apps/web/components/footer.tsx`

**Approach:**
- Adicionar 3 novos ícones SVG seguindo o mesmo padrão dos existentes (GitHub, LinkedIn):
  - **Instagram**: ícone SVG inline, link para `https://instagram.com/USERNAME`
  - **WhatsApp**: ícone SVG inline, link para `https://wa.me/NUMERO`
  - **Email**: ícone SVG de envelope, link `mailto:gleider.ec@gmail.com`
- Manter mesmas classes Tailwind: `text-gray-500 hover:text-white transition-colors`
- Manter `target="_blank" rel="noopener noreferrer"` nos links externos
- Email não precisa de `target="_blank"`

**Patterns to follow:**
- Padrão exato dos ícones de GitHub e LinkedIn em `apps/web/components/footer.tsx`

**Test scenarios:**
- Happy path: Footer deve renderizar 5 ícones sociais (GitHub, LinkedIn, Instagram, WhatsApp, Email)
- Happy path: Cada ícone deve ter `aria-label` descritivo para acessibilidade
- Happy path: Links devem abrir na URL correta ao clicar
- Edge case: Em telas muito pequenas, os 5 ícones devem caber sem quebra de layout

**Verification:**
- Visualizar o footer no browser em desktop e mobile e confirmar que todos os ícones aparecem e funcionam

---

- [ ] **Unit 6: Sitemap e robots.txt**

**Goal:** Adicionar geração automática de sitemap.xml e robots.txt para melhorar indexação.

**Requirements:** R5, R6

**Dependencies:** Nenhuma (pode ser implementado em paralelo)

**Files:**
- Create: `apps/web/app/sitemap.ts`
- Create: `apps/web/app/robots.ts`

**Approach:**
- **sitemap.ts**: Abordagem static-first com enriquecimento opcional via API:
  - Base garantida: rotas estáticas (`/`, `/blog`, `/projetos`, `/experiencia`) + blog posts publicados via `getAllPosts`
  - Enriquecimento: buscar projetos INTERNAL via `getProjects`, envolver em try/catch — se API falhar, sitemap retorna apenas a base sem quebrar
  - Filtrar projetos EXTERNAL (retornam 404 na página, não devem estar no sitemap)
  - Definir `changeFrequency` e `priority` adequados por tipo de página
  - Usar `date` do frontmatter como `lastModified` para blog posts
- **robots.ts**: Exportar config permitindo todos os crawlers com referência ao sitemap, bloqueando `/admin/*`

**Patterns to follow:**
- `getAllPosts` de `apps/web/lib/mdx.ts` para listar posts
- `getProjects` de `apps/web/lib/api.ts` para listar projetos
- Convenções Next.js App Router para `sitemap.ts` e `robots.ts`

**Test scenarios:**
- Happy path: Acessar `/sitemap.xml` deve retornar XML válido com todas as rotas públicas
- Happy path: Acessar `/robots.txt` deve retornar `User-agent: *` com `Allow: /` e `Sitemap: https://gleider.dev/sitemap.xml`
- Happy path: Sitemap deve incluir URLs de blog posts existentes
- Edge case: Posts com `published: false` não devem aparecer no sitemap
- Edge case: Rotas de admin (`/admin/*`) não devem aparecer no sitemap
- Edge case: Projetos EXTERNAL não devem aparecer no sitemap (retornam 404 na página)
- Error path: Se `getProjects()` falhar, sitemap deve retornar rotas estáticas + blog posts sem erro

**Verification:**
- Acessar `/sitemap.xml` e `/robots.txt` no browser e validar conteúdo

## System-Wide Impact

- **Interaction graph:** OG image routes são endpoints públicos novos — não afetam auth nem middleware existente. Sitemap faz fetch na API de projetos, depende da disponibilidade do backend.
- **Error propagation:** Falha na geração de OG image não deve quebrar a página — Next.js trata isso gracefully retornando sem imagem.
- **State lifecycle risks:** Nenhum — meta tags e OG images são stateless e gerados on-demand.
- **API surface parity:** Nenhuma mudança nos endpoints da API NestJS.
- **Unchanged invariants:** Auth flow, CRUD de projetos, blog MDX rendering e admin routes não são afetados.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| OG images podem demorar para gerar em primeira requisição | `next/og` faz cache automático; ISR do Next.js também ajuda |
| Fontes customizadas em OG images podem não carregar em produção | Usar a fonte padrão do Satori inicialmente; customizar depois se necessário |
| WhatsApp link precisa de número real | Validar formato `+55XXXXXXXXXXX` durante implementação |
| Sitemap com fetch na API pode falhar se backend estiver down | Abordagem static-first: rotas estáticas + blog posts sempre presentes, projetos da API como enriquecimento envolvido em try/catch |

## Sources & References

- Related plans: `docs/plans/2026-04-14-002-feat-google-analytics-ga4-plan.md` (GA4 já implementado)
- Related code: `apps/web/app/layout.tsx`, `apps/web/components/footer.tsx`
