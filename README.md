# IoT Machine Monitor

A real-time application for visualizing and monitoring IoT connected devices on a map. The application provides real-time tracking and status updates for connected machines through an interactive map interface.

## Features

- 🗺️ Display IoT devices on an interactive map
- 🔄 Real-time updates via WebSocket connection
- 📱 Responsive design for mobile and desktop
- ℹ️ Detailed information view for each machine
- 🔔 Notification for real-time data changes
- 📦 Progressive Web App (PWA) support
- 🔍 Machine status tracking and history
- 📍 Precise location monitoring

## Prerequisites

Before running the application, make sure you have:

- Node.js 20.x or higher
- npm 9.x or higher
- Browser with WebSocket support
- API endpoints for machine data (see section below)

## Configuration

1. Create a `config.ts` file in the `src` directory using the template from `config.sample.ts`:

```typescript
export const API_BASE_URL = "https://your-api-url/api/v1";
export const WS_URL = "wss://your-websocket-url/api/v1/events";
```

⚠️ **Important**: The application requires this configuration file to work. Make sure to set the correct URLs for your API and WebSocket endpoints.

## Installation & Running

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

The application can be run in a Docker container:

```bash
# Build the Docker image
docker build -t iot-maps-app .

# Run the container
docker run -d -p 3000:4173 --name iot-maps iot-maps-app
```

Access the application at `http://localhost:3000`

⚠️ **Note**: Remember to create the `config.ts` file before building the Docker image.

## Progressive Web App (PWA)

This application is PWA-enabled, which means you can install it as a standalone application on your device!

### Installing the PWA

#### On Desktop:

1. Open the application in Chrome
2. Click the install icon in the address bar
3. Follow the installation prompts

#### On Mobile:

1. Open the application in your mobile browser
2. Tap the "Add to Home Screen" option in your browser menu
3. Follow the installation prompts

### Testing PWA Features

1. Build the application: `npm run build`
2. Start the preview server: `npm run preview`
3. Use browser dev tools to verify:
   - Service Worker registration
   - Offline functionality
   - App manifest
   - Install the app on your local

## Tech Stack

- **Frontend Framework**: React 19.x + TypeScript
- **Build Tool**: Vite 6.x
- **Map Integration**: Leaflet
- **Real-time Updates**: WebSocket browser api
- **PWA**: Vite PWA Plugin
- **Styling**:
  - TailwindCSS
  - shadcn/ui components
- **Data Management**:
  - React Query for data fetching
  - Zod for data validation

## Development

### Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── config.ts      # Application configuration
```

### Key Features Implementation

- **Real-time Updates**: WebSocket connection maintains live data feed
- **Map Visualization**: Leaflet integration for machine locations
- **Status Monitoring**: Real-time machine status updates
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **PWA Support**: Offline capability and installable app
