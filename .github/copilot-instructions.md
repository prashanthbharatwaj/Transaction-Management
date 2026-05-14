# Transactions Management Dashboard - Copilot Instructions

This is a Next.js TypeScript project for a Transactions Management Dashboard that allows customers to:
- View transaction history
- Download invoices
- Retry failed payments in bulk

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `lib/` - Utility functions and mock data
- `components/` - Reusable React components
- `types/` - TypeScript type definitions

## Key Features

- Transaction history with ID, amount, date, and status
- PDF invoice download simulation (2-second delay)
- Batch payment retry functionality
- Independent loading states for concurrent API calls
- 20% failure rate simulation for retry operations

## Development

Run `npm run dev` to start the development server.

## Build & Deploy

Run `npm run build` to create a production build.
