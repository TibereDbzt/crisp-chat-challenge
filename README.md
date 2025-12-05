# Crisp Chat

A real-time chat application built with Vue 3 and Socket.io, featuring multiple chat rooms and live user presence.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone git@github.com:TibereDbzt/crisp-chat-challenge.git
cd crisp/chat
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the Application

1. Start the server
```bash
cd server
npm run dev
```

2. Start the client (in a new terminal)
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## Tech Stack

### Frontend
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **Socket.io Client** for real-time communication
- **Shadcn/ui** + **Tailwind CSS** for UI components
- **Vite** for fast development

### Backend
- **Node.js** + **Express**
- **Socket.io** for WebSocket communication
- **TypeScript** with Clean Architecture principles
- In-memory data storage

## Features

- 🚀 Real-time messaging
- 💬 Multiple chat rooms
- 👥 Live user presence
- 🔄 Room creation and management
- 📱 Responsive design
- ⚡ Message grouping (Messenger-style)
- 🎯 Auto-scroll with new message indicator

## Project Structure

```
chat/
├── client/          # Vue 3 frontend
│   ├── src/
│   │   ├── features/
│   │   │   └── chat/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
│
└── server/          # Node.js backend
    ├── src/
    │   ├── domain/
    │   ├── infrastructure/
    │   └── index.ts
    └── package.json
```

### Backend Architecture

The server follows **Clean Architecture** principles:
- **Domain Layer**: Contains business entities (`User`, `Room`, `Message`) and repository interfaces
- **Use Cases**: Business logic isolated from infrastructure (e.g., `joinRoom`, `sendMessage`, `getRooms`)
- **Infrastructure Layer**: Socket.io handlers, in-memory repositories, and Express setup
- **Benefits**: Testability, maintainability, and clear separation of concerns

### Frontend Architecture

The client uses a **feature-based architecture**:
- **Features**: Domain-specific modules (`chat/`) with their own components, stores, API clients, and types
- **Shared Components**: Reusable UI components (`components/ui/`) built with Shadcn/ui
- **State Management**: Pinia stores for centralized state
- **API Layer**: Abstracted Socket.io communication through composables and API clients

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
