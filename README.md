# SM Couture App API

This is a Next.js-based API service that manages scheduling functionality for SM Couture, integrating with Calendly for appointment management. The API provides secure endpoints for managing user schedules and handling Calendly webhooks.

## Features

- 📅 Calendly integration for appointment scheduling
- 🔐 Authentication using Clerk
- 📦 PostgreSQL database with Drizzle ORM
- 🚀 Built with Next.js API routes
- 🔄 Webhook handling for real-time schedule updates
- 🛡️ TypeScript for type safety

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database (or a Neon.tech account)
- Calendly account with webhook capabilities
- Clerk account for authentication

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=your_postgresql_connection_string
CALENDLY_WEBHOOK_SECRET=your_calendly_webhook_signing_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run database migrations:

```bash
npx drizzle-kit push:pg
```

## Development

Run the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### GET /api/schedules

- Returns upcoming schedules for the authenticated user
- Requires authentication via Clerk

### POST /api/webhook

- Handles Calendly webhook events
- Requires valid Calendly webhook signature
- Supports events:
  - invitee.created
  - invitee.canceled

## Database Schema

The project uses Drizzle ORM with the following main table:

### user_schedules

- id (serial, primary key)
- event_id (varchar)
- userId (varchar)
- event (varchar)
- start_time (timestamp)
- status (varchar)
- cancel_url (varchar)
- reschedule_url (varchar)
- created_at (timestamp)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests (when available)
4. Submit a pull request

## License

[Add your license here]
