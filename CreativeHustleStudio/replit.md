# Dorm Desk Studio - Creative Business Platform

## Overview

Dorm Desk Studio is a full-stack web application designed to help creative individuals build and manage their businesses. The platform provides a comprehensive learning curriculum, business templates, activity tracking, and progress monitoring tools. Built with modern web technologies, it offers both free and premium tiers with subscription management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Express sessions with PostgreSQL storage
- **Payment Processing**: Stripe integration for subscriptions

### Development Setup
- **Environment**: Replit with Node.js 20, PostgreSQL 16
- **Hot Reloading**: Vite HMR for frontend, tsx for backend development
- **Type Checking**: Shared TypeScript configuration across client/server

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: Authentication, subscription tiers, Stripe integration
- **Modules**: Learning curriculum with tier-based access
- **Templates**: Downloadable business resources
- **User Progress**: Module completion tracking
- **Activities**: Business activity logging and time tracking
- **Challenge Progress**: 7-day business challenge system

### API Layer (server/routes.ts)
- RESTful API endpoints for all major features
- Mock authentication middleware for development
- Stripe integration for payment processing
- Error handling and request logging middleware

### UI Components
- **Navigation**: Sticky header with role-based menu items
- **Dashboard**: Welcome section, stats cards, curriculum overview
- **Curriculum**: Module-based learning system with progress tracking
- **Templates**: Categorized business template library
- **Tracker**: Activity logging and business metrics
- **Admin**: Content management for modules and templates

## Data Flow

1. **Authentication**: Mock authentication system (development) with user context
2. **Content Access**: Tier-based access control (free/premium/lifetime)
3. **Progress Tracking**: Real-time updates via TanStack Query mutations
4. **Payment Flow**: Stripe integration with webhook handling
5. **Data Persistence**: PostgreSQL with Drizzle ORM for type-safe queries

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless
- **ORM**: Drizzle with PostgreSQL dialect
- **UI**: Radix UI primitives with shadcn/ui components
- **Payment**: Stripe for subscription management
- **Date Handling**: date-fns for date formatting
- **Form Validation**: Zod schemas with React Hook Form

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Strict configuration with path aliases
- **CSS**: Tailwind CSS with PostCSS
- **Linting**: ESLint configuration for React/TypeScript

## Deployment Strategy

### Production Build
- Frontend: Vite build to `dist/public`
- Backend: esbuild bundle to `dist/index.js`
- Static assets served from Express in production

### Environment Configuration
- Development: `npm run dev` with hot reloading
- Production: `npm run build && npm run start`
- Database: Drizzle migrations with `npm run db:push`

### Replit Configuration
- Auto-deployment enabled for production builds
- Port 5000 mapped to external port 80
- PostgreSQL module for database provisioning

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```