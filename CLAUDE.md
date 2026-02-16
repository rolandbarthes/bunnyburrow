# Bunny Burrow

A Progressive Web App (PWA) for rabbit sitting services — like PetBacker, but just for rabbits.

## Project Overview

Bunny Burrow connects rabbit owners with trusted rabbit sitters. Any user can act as both an owner (seeking care) and a sitter (offering care), switching between modes. An admin role exists for platform moderation.

## Tech Stack

- **Frontend:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Firebase (Firestore, Auth, Storage, Cloud Functions)
- **Hosting:** Netlify (frontend), Firebase (backend/functions)
- **Package Manager:** npm
- **Language:** TypeScript throughout

## User Roles

- **Owner/Sitter:** Any registered user can toggle between seeking care for their rabbits and offering sitting services. A single account supports both modes.
- **Admin:** Separate admin role for moderation, user management, and platform oversight.

## Core Features (Planned)

- User authentication (email, Google sign-in)
- User profiles with rabbit profiles (photos, breed, care needs)
- Sitter listings with search/filter (location, availability, experience)
- Booking system (request, accept, decline, cancel)
- Reviews and ratings
- In-app messaging between owners and sitters
- Push notifications for booking updates
- Admin dashboard for moderation

## Project Structure

```
src/
├── components/     # Reusable UI components (shadcn/ui based)
├── pages/          # Route-level page components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions, Firebase config, helpers
├── types/          # TypeScript type definitions
├── context/        # React context providers (auth, user role, etc.)
├── services/       # Firebase service layer (Firestore queries, auth, storage)
└── assets/         # Static assets (images, icons)
```

## Code Conventions

- Use functional React components with hooks
- Use TypeScript strict mode
- Prefer named exports
- Use absolute imports via `@/` path alias
- Keep components small and focused — extract logic into custom hooks
- Firebase calls go through the `services/` layer, never called directly from components
- Use Firestore security rules for authorization, not just client-side checks
- Tailwind for styling; avoid inline styles and CSS modules

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint
- `npm run type-check` — Run TypeScript compiler check

## Git

- Repository hosted on GitHub (details TBD)
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Branch naming: `feature/`, `fix/`, `chore/` prefixes

## Deployment

- Frontend deploys to Netlify (auto-deploy from main branch)
- Firebase Functions deploy via `firebase deploy --only functions`

## Environment Variables

- Firebase config stored in `.env.local` (never committed)
- `.env.example` provided as a template
