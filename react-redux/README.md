# React + Redux (Vite) — Kabaw Sockets UI

A lightweight React + Redux Toolkit app (built with Vite) that provides a UI for connecting to a Go WebSocket server and chatting in real time.

## Quick start

```bash
# From the project root
cd react-redux

# Install deps
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Running the Go WebSocket server

The UI expects a WebSocket backend at `ws://localhost:8080/ws`.

```bash
# From the project root
# Requires Go 1.21+
go run main.go

# Alternatively, build and run
# go build -o kabaw-server
# ./kabaw-server
```

Server endpoints:

- `GET /` — simple landing page with links
- `GET /health` — health check JSON
- `GET /stats` — number of connected clients
- `GET /ws` — WebSocket endpoint; query params: `username`, `channel` (default `general`)
- `GET /test` — simple HTML test client

Example WS URL:

```
ws://localhost:8080/ws?username=Alice&channel=general
```

Message schema (JSON):

```json
{
  "type": "message | user_connected",
  "username": "string",
  "user_id": "string",
  "content": "string",
  "timestamp": "RFC3339",
  "channel": "string"
}
```

## Features

- **WebSocket connection form**: Enter server URL params (username/channel) and connect/disconnect.
- **Live chat**: Send and receive messages over the active socket.
- **Status bar**: Shows connection status.
- **Responsive UI**: Basic layout with reusable atoms/molecules/organisms.
- **Redux state management**: Centralized store with actions and selectors.
- **Middleware-driven sockets**: WebSocket lifecycle handled via a custom Redux middleware.

## Folder structure

```
src/
  app/
    Store.jsx                 # Configures Redux store and middleware
    features/
      Chat.jsx                # Chat slice (messages array + reducers)
      Connection.jsx          # Connection slice (connected/error)
      User.jsx                # User slice (username, userId, channel)
    middleware/
      connectionMiddleware.js # WebSocket connect / message / close handling
  components/
    atoms/                    # Buttons, inputs, labels, etc.
    molecules/                # Collapsible, dropdown, sidebar, etc.
    organisms/                # Chat box, message form, status bar, etc.
  hooks/
    use-mobile.js             # Responsive helpers
  lib/
    utils.js                  # Utility helpers
  pages/
    Dashboard.jsx
    Login.jsx
  App.jsx
  main.jsx
```

## Redux architecture (deep dive)

- Store: `src/app/Store.jsx`

  - Reducers: `user`, `connection`, `chat`
  - Middleware: `connectionMiddleware`

- User slice: `src/app/features/User.jsx`

  - State: `{ username: string, userId: string|null, channel: string }`
  - Actions: `setUsername`, `setUserId`, `setChannel`, `clearUser`

- Connection slice: `src/app/features/Connection.jsx`

  - State: `{ connected: boolean, error: any|null }`
  - Actions: `setConnected`, `setDisconnected`, `setConnectionError`

- Chat slice: `src/app/features/Chat.jsx`

  - State: `{ message: Array<any> }` (array of message objects)
  - Actions: `addMessage`, `clearMessages`

- Middleware: `src/app/middleware/connectionMiddleware.js`
  - On `connection/setConnected`:
    - Builds WS URL: `ws://localhost:8080/ws?username=<username>&channel=<channel>` from `user` slice
    - Opens WebSocket and attaches handlers (`onopen`, `onclose`, `onerror`, `onmessage`)
  - On `connection/setDisconnected`:
    - Closes socket if open
  - Notes:
    - `onmessage` is currently a no-op placeholder; you can dispatch parsed messages to the chat slice by enabling something like:
      ```js
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        dispatch({ type: "chat/addMessage", payload: data });
      };
      ```

## Go server architecture (high level)

- Code: `main.go` (module `kabaw-discord`)
- Libraries: `github.com/gorilla/websocket`
- Core types:
  - `Hub`: tracks clients, broadcast channel, register/unregister
  - `Client`: per-connection writer/reader goroutines
  - `Message`: JSON payload sent between server and clients
- Flow:
  - `GET /ws` upgrades to WebSocket; reads `username` and `channel` query params
  - Server assigns a random `user_id` and sends a `user_connected` welcome message to the connecting client
  - `Client.readPump` reads JSON, enriches with `username/user_id/channel/timestamp`, and forwards to `Hub.broadcast`
  - `Hub.Run` fans out messages to clients in the same `channel`
  - `Hub.StartMessageSimulation` periodically injects simulated messages into the `general` channel when clients are connected

## End-to-end: run and test

1. Start the server (terminal A):

```bash
# From project root
go run main.go
# Server listens on :8080
```

2. Start the React app (terminal B):

```bash
cd react-redux
npm install
npm run dev
# Open the URL printed by Vite (usually http://localhost:5173)
```

3. In the UI:

- Set a `username` and keep `channel` as `general` (or change it)
- Click connect to open `ws://localhost:8080/ws?username=<name>&channel=<channel>`
- Send messages and observe simulated messages every ~10s in `general`

4. Optional checks:

- Open `http://localhost:8080/health` to verify server health
- Open `http://localhost:8080/stats` to see the number of connected clients

## Troubleshooting

- If the UI fails to connect, ensure the Go server is running on port 8080 and that the browser can reach `ws://localhost:8080/ws`.
- For cross-origin/local dev, the server allows all origins (`CheckOrigin: true`). In production, restrict origins.
- If messages aren’t appearing in the UI, ensure `onmessage` in `connectionMiddleware.js` dispatches to the `chat` slice.
- Verify `username` and `channel` are set in the `user` slice before connecting.
