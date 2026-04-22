# StudySpot

A mobile-first web app that helps students find study-friendly locations based on real user-submitted data about study conditions such as noise level, outlet availability, WiFi, seating type, purchase requirement, and open hours.

## Project Structure

```
StudySpot/
├── client/     # React PWA (local dev: Vite)
├── api/        # Express API (local dev: Node)
├── supabase/   # SQL migrations + seeds
├── docs/       # PRD, site map, OpenAPI, deployment notes
├── README.md
└── .gitignore
```

## Features

- **Location Discovery**: Find study spots based on specific criteria
- **User Contributions**: Submit and review study locations
- **Real-time Data**: Up-to-date information about study conditions
- **Mobile-First Design**: Optimized for mobile devices
- **Progressive Web App**: Installable on mobile devices

## Tech Stack

- **Frontend**: React + Vite (PWA)
- **Backend**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies for both client and API
3. Set up Supabase project
4. Configure environment variables
5. Run development servers

### Development

```bash
# Client (React PWA)
cd client
npm run dev

# API (Express)
cd api
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
