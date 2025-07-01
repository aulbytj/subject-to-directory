# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production (configured for static export)
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 13.5.1 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom middleware
- **UI**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with dark/light theme support
- **Forms**: React Hook Form with Zod validation

### Project Structure

#### Core Application Logic
- `lib/supabase.ts` - Supabase client and TypeScript interfaces for all database entities (Profile, Property, Message, Favorite)
- `lib/auth.ts` - Authentication wrapper functions (signIn, signUp, signOut)
- `middleware.ts` - Route protection and authentication redirects

#### Authentication Flow
- Uses custom `AuthProvider` context with `useAuth` hook
- Protected routes: `/dashboard`, `/profile`, `/list-property`, `/messages`
- Auth routes redirect if already logged in: `/login`, `/signup`
- Profile creation is automatic via database trigger on user signup

#### Database Schema
The application uses a comprehensive schema for a real estate "subject-to" directory:

**Core Tables:**
- `profiles` - User profiles with roles (buyer/seller/both), verification status
- `properties` - Property listings with detailed financial information (loan balance, interest rates, payments)
- `property_images` - Multiple images per property with primary/ordering
- `messages` - Secure messaging between users for property inquiries
- `favorites` - User saved properties
- `property_views` - Analytics tracking

**Key Business Logic:**
- Properties have detailed financial data for creative financing (subject-to deals)
- Row Level Security (RLS) policies enforce data access permissions
- Property view counting with `increment_property_views()` function
- Automatic profile creation via `handle_new_user()` trigger

#### Component Architecture
- Page components in `app/` directory using App Router
- Reusable UI components in `components/ui/` (shadcn/ui)
- Business components in `components/` root
- Custom hooks in `hooks/` for auth and toast functionality

#### API Routes
- `app/api/properties/route.ts` - Property filtering and search with comprehensive query parameters
- Uses `lib/properties.ts` for database operations

### Configuration Notes
- Next.js configured for static export (`output: 'export'`)
- TypeScript with strict mode enabled
- ESLint configured to ignore build errors
- Images are unoptimized for static export compatibility
- Path aliases configured: `@/*` maps to root directory

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Development Patterns
- Use `useAuthContext()` for accessing current user state
- Database operations should respect RLS policies
- All database types are defined in `lib/supabase.ts`
- Use shadcn/ui components for consistent styling
- Theme switching handled by `ThemeProvider` with system preference support