# Sveltauth

A modern minimalist authentication solution built with SvelteKit, featuring:

- User login and registration flows
- OTP verification
- Session management
- Secure API endpoints
- TailwindCSS styling

## Features

- Built with SvelteKit 5
- TypeScript support
- ESLint and Prettier configured
- TailwindCSS for styling
- Node.js adapter for deployment

## Development

First, install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev

# or open in browser automatically
pnpm run dev -- --open
```

## Building for Production

```bash
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

## Deployment

This project uses the `@sveltejs/adapter-node` for Node.js deployment. You may need to install other [adapters](https://kit.svelte.dev/docs/adapters) for different environments.

## Project Structure

Key files and directories:

- `src/routes/` - Contains all page routes
- `src/lib/` - Shared components and utilities
- `src/lib/api.ts` - API endpoints
- `src/lib/session.ts` - Session management
