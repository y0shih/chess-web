# CheSy - Modern Chess Web Application

A modern, responsive chess web application built with Next.js 14 and TypeScript.

## Features

- **Multiple Game Modes**
  - Classic: Traditional chess gameplay
  - Alone: Debug mode to move both sides
  - Ranked: Competitive matches with ELO rating (coming soon)
  - Chaos: Random events and power-ups (coming soon)

- **User Authentication**
  - Login/Register system
  - User profiles with statistics
  - ELO rating tracking
  - Match history

- **Modern UI/UX**
  - Clean, responsive design
  - Tailwind CSS styling
  - Smooth animations and transitions
  - Mobile-friendly interface

- **Real-time Features**
  - Socket.IO integration for live gameplay
  - Real-time chat during matches
  - Live game state synchronization

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Nest.js (Game logic, Elo system)
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui components
- **Chess Logic**: chess.js library
- **Real-time**: Socket.IO client
- **State Management**: React hooks (useState, useEffect)

## Getting Started

### Prerequisites

- Node.js 18+ or npm/pnpm
- A backend server running on localhost:8000 (Socket.IO)

### Installation

1. Clone the repository
```bash
git clone https://github.com/y0shih/chess-web.git
cd chess-web
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Run the development server
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## Backend API Requirements

The frontend expects the following API endpoints:

### Authentication

**POST /api/auth/login**
```json
{
  "email": "string",
  "password": "string"
}
```

**POST /api/auth/register**
```json
{
  "name": "string",
  "email": "string", 
  "password": "string"
}
```

**Response format for both:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "elo": "number",
    "joinDate": "string",
    "matchesPlayed": "number",
    "wins": "number",
    "losses": "number"
  },
  "token": "string"
}
```

### User Profile

**GET /api/user/profile** (requires authentication)
Returns user profile data in the same format as the auth response.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx tsc --noEmit` - Type check

## Project Structure

```
chess-web/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── ui/             # Reusable UI components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Global styles
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
