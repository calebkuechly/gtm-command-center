# GTM Command Center

A comprehensive, real-time dashboard web application for a Director of Go-To-Market (Publisher role) who manages a portfolio of education brands from launch to scale.

## Features

- **Real-time Dashboard**: Live metrics, portfolio performance, and pipeline status
- **Brand Management**: Track active brands through stages from ideation to scale
- **Visionary Pipeline**: Manage potential brand partners through the sales funnel
- **Weekly Planning**: Organize priorities and track task completion
- **Key Obsessions**: Expandable sections for deep-dive into critical metrics
- **Dark Mode**: Full light/dark theme support
- **Keyboard Shortcuts**: Power user shortcuts for everything
- **Mobile Responsive**: Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **UI Components**: Radix UI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/gtm-command-center.git
cd gtm-command-center
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database connection string and other configuration.

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (dashboard)/      # Dashboard layout group
│   ├── api/              # API routes
│   └── providers.tsx     # App providers
├── components/
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components (Header, Sidebar)
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── store/                # Zustand state management
└── types/                # TypeScript type definitions
```

## Key Components

### Dashboard Sections

1. **Hero Section**: Mission statement and most critical metric
2. **Today's Snapshot**: Portfolio performance, pipeline status, weekly focus
3. **Quick Actions**: Navigation cards to key areas
4. **Key Obsessions**: Expandable sections for deep metrics
5. **Active Brand Status Board**: Sortable/filterable table of all brands
6. **Weekly Priorities**: Day-by-day task management
7. **Important Reminders**: Milestones, decision frameworks, budgets
8. **Quick Contacts**: Searchable team directory
9. **Quick Stats**: Bottom bar with key metrics

### Keyboard Shortcuts

- `Cmd/Ctrl + K`: Open command palette
- `Cmd/Ctrl + D`: Go to dashboard
- `Cmd/Ctrl + P`: Go to pipeline
- `Cmd/Ctrl + B`: Go to brands
- `Cmd/Ctrl + W`: Go to weekly planning
- `Cmd/Ctrl + \`: Toggle sidebar

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/dashboard` | GET | Fetch all dashboard data |
| `/api/brands` | GET, POST | List/create brands |
| `/api/brands/[id]` | GET, PATCH, DELETE | Single brand operations |
| `/api/pipeline` | GET | Pipeline overview |
| `/api/pipeline/visionary` | POST | Create new visionary |
| `/api/priorities` | GET, POST | Weekly priorities |
| `/api/priorities/[id]` | PATCH, DELETE | Update/delete priority |
| `/api/contacts` | GET, POST | Contact management |
| `/api/alerts/[id]/read` | POST | Mark alert as read |

## Database Schema

Key models:
- **User**: Authentication and user management
- **Brand**: Education brand entities
- **Visionary**: Potential brand partners
- **Metric**: Time-series performance data
- **Priority**: Weekly task management
- **Contact**: Team directory
- **Alert**: System notifications

## Customization

### Theming

Colors are defined in `tailwind.config.ts`. The app uses a custom color palette:
- Primary: Blue (#2563eb)
- Secondary: Purple (#7c3aed)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Danger: Red (#ef4444)

### Adding New Components

1. Create component in appropriate directory
2. Export from index.ts
3. Add to dashboard page if needed

## Performance

- Sub-2s page loads
- 60fps animations
- Optimistic UI updates
- Skeleton loading states
- Data caching with React Query

## Deployment

The app is designed for Vercel deployment:

```bash
npm run build
```

Set environment variables in Vercel dashboard and deploy.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
