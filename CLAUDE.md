# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.5 frontend application for JunieMVC, built with TypeScript and Tailwind CSS v4. The project uses the new App Router architecture and is structured as a standard create-next-app template.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Structure**: Standard Next.js app directory structure

## Key Configuration

- **TypeScript**: Configured for ES2017 target with path mapping (`@/*` → `./src/*`)
- **Styling**: Uses Tailwind CSS v4 with PostCSS plugin
- **Import alias**: `@/` points to `src/` directory
- **App structure**: All routes and components live under `src/app/`

## File Structure

```
src/
  app/
    layout.tsx    # Root layout with font configuration
    page.tsx      # Home page component
    globals.css   # Global styles and Tailwind imports
```

The project follows Next.js App Router conventions where each directory under `app/` can contain:
- `page.tsx` for route components
- `layout.tsx` for shared layouts
- `loading.tsx`, `error.tsx`, etc. for special UI states

## Claude Permissions

Custom permissions are configured in `.claude/permissions.json` to control file operations, command execution, and access restrictions for this project.