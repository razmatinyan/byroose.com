# byroose creative agency

byroose.com is the digital home of byroose, a creative agency for brands that are tired of shouting into the void. The agency brings strategy, marketing, web design and development, and AI-assisted content into one connected practice.

The site is designed to turn a clear point of view into measurable action. It presents the agency's work, services, process, learning products, insights, and contact paths in a bold editorial experience that remains fast, accessible, and easy to use on every screen.

## Project status

The current foundation is a responsive Nuxt landing page converted from the original visual template. It includes a source-owned component system, semantic design tokens, reusable Tailwind class groups, Lucide icons, Lenis smooth scrolling, and an SSR-safe GSAP integration. Content systems, case studies, forms, analytics, SEO expansion, and richer motion will be added as the project grows.

## Technology

- Nuxt 4 and Vue 3
- TypeScript
- Tailwind CSS v4
- Shadcn Vue with Reka UI
- Nuxt Icon with Lucide
- Nuxt Image
- Nuxt Fonts with Geist
- VueUse
- Lenis
- GSAP
- Zod

## Local development

Requirements:

- A current Node.js LTS release
- npm

Install dependencies and start the development server:

~~~bash
npm install
npm run dev
~~~

The application is available at http://localhost:3000 by default.

## Available commands

~~~bash
npm run dev
npm run typecheck
npm run build
npm run generate
npm run preview
~~~

## Project structure

~~~text
app/
  assets/css/       Theme tokens and reusable Tailwind class groups
  components/       Landing, layout, card, shared, and UI components
  composables/      Reusable stateful and side-effect behavior
  lib/              Pure helpers, shared constants, and icon names
  plugins/          Nuxt runtime integrations
docs/               Architecture, rules, design system, content, and workflow
public/             Static public assets
~~~

See [Architecture](docs/ARCHITECTURE.md) for dependency boundaries and placement rules.

## Documentation

- [AI agent guide](AGENTS.md)
- [Project rules](docs/RULES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Content and SEO guide](docs/CONTENT_GUIDE.md)
- [AI workflow and Git delivery](docs/AI_WORKFLOW.md)
- [Claude Code guide](CLAUDE.md)

## Contributing

Keep changes focused, reuse established patterns, and verify the affected behavior before delivery. Review and update the relevant documentation after every feature, refactor, bug fix, dependency update, configuration change, or design-system change. Keep documentation and implementation in the same focused conventional commit, then follow the push policy in [AI workflow and Git delivery](docs/AI_WORKFLOW.md).
