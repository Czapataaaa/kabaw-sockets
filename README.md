# Kabaw Chat WebSocket Server

A simple Go WebSocket server for real-time messaging, similar to Discord. This server provides a basic chat system with support for multiple channels and users.

## Features

- Real-time messaging via WebSockets
- Multiple channel support
- User identification
- Connection statistics
- Health check endpoint
- Simple web interface for testing
- **Cross-Origin Resource Sharing (CORS) support** for WebSocket connections
- **Automatic message simulation** in the "general" channel for testing
- **Console logging** for all messages, connections, and disconnections (server-side)
- **Frontend console logging** in browser developer tools (client-side)

## Prerequisites

- Go 1.21 or higher
- Internet connection (for downloading dependencies)

## Installation & Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd /home/moon8ear/Desktop/projects/kabawDiscord
   ```

2. **Install dependencies:**
   ```bash
   go mod tidy
   ```

3. **Run the server:**
   ```bash
   go run main.go
   ```

The server will start on port 8080 by default.

## Testing Cross-Origin WebSocket Connections

To test cross-origin WebSocket functionality:

1. **Start the WebSocket server (port 8080):**
   ```bash
   go run main.go
   ```

2. **Start the HTTP client server (port 6969):**
   ```bash
   npm install
   npm start
   ```

3. **Access the test client:**
   - Open `http://localhost:6969/` in your browser (default route)
   - The HTML is served from port 6969, but connects to WebSocket on port 8080
   - This demonstrates cross-origin WebSocket support

### How Cross-Origin WebSocket Works

The cross-origin functionality is enabled through two key mechanisms:

#### Server-Side Configuration (Go)
```go
var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        // Allow connections from any origin (for development)
        return true
    },
}
```
- **Disables origin checking**: Normally WebSocket connections are restricted to same-origin
- **Allows any domain/port** to connect to the WebSocket server
- **Returns `true`** for all origin requests, bypassing browser security restrictions

#### Client-Side Connection (JavaScript)
```javascript
// Cross-origin WebSocket connection to port 8080 from port 6969
const wsUrl = `ws://localhost:8080/ws?username=${username}&channel=${channel}`;
const ws = new WebSocket(wsUrl);
```
- HTML served from `http://localhost:6969` (npm server)
- WebSocket connects to `ws://localhost:8080` (Go server)
- **Different ports = different origins** → Cross-origin request
- Browser allows connection because server's `CheckOrigin` returns `true`

#### Additional CORS Support
- npm http-server provides CORS headers: `access-control-allow-origin: *`
- Enables cross-origin CSS loading: `http://localhost:8080/static/styles.css`
- Demonstrates real-world scenario: frontend from CDN connecting to API

**Security Note**: For production, restrict origins:
```go
CheckOrigin: func(r *http.Request) bool {
    origin := r.Header.Get("Origin")
    return origin == "https://yourdomain.com"
}
```

## Message Simulation

The server automatically generates simulated messages in the **"general"** channel to keep the chat active during testing:

- **Automatic messages**: Random messages are sent every 10 seconds
- **Only when active**: Messages are only sent when users are connected to the "general" channel
- **Variety**: 18+ different message templates with 3 different simulated users (each with unique UUIDs)
- **Consistent timing**: Messages sent every 10 seconds for predictable testing

### Simulated Test Users

When connected to the **"general"** channel, you'll see messages from these automated test users (each with unique UUIDs):

| Username | UUID | Description |
|----------|------|-------------|
| `ChatBot` | `550e8400-e29b-41d4-a716-446655440001` | Friendly bot that welcomes users and provides helpful tips |
| `Developer` | `550e8400-e29b-41d4-a716-446655440002` | Programming-focused user discussing code and development |
| `SystemHelper` | `550e8400-e29b-41d4-a716-446655440003` | Helper bot offering guidance and support |

### Sample Message Types

The simulated users will send various types of messages including:
- **Welcome messages**: "Welcome to the chat! 👋"
- **Programming discussions**: "Anyone else working on Go projects?"
- **General chat**: "How's everyone doing today?"
- **System updates**: "The server is running smoothly"
- **Friendly interactions**: "Hope you're having a great day! 😊"
- **Conversation starters**: "Coffee or tea? ☕"

This feature makes it easy to test the real-time messaging functionality without needing multiple users connected simultaneously.

**To see simulated messages:**
1. Start the WebSocket server: `go run main.go`
2. Connect to the "general" channel via the test client
3. Watch as simulated messages appear automatically every 10 seconds
4. The simulation stops when no users are connected to "general"

## Console Logging

The server provides detailed console logging for monitoring activity:

### Log Types

- **`[CONNECT]`**: User connections with channel and total client count
- **`[DISCONNECT]`**: User disconnections with updated client count
- **`[MESSAGE]`**: Real user messages with channel, username, and content
- **`[SIMULATED]`**: Automated test messages with user ID and content

### Example Console Output

```
2025/08/15 15:16:35 Server starting on port :8080
2025/08/15 15:16:40 [CONNECT] User: TestUser | Channel: general | Total clients: 1
2025/08/15 15:16:45 [SIMULATED] Channel: general | User: ChatBot (ID: 550e8400-e29b-41d4-a716-446655440001) | Content: Welcome to the chat! 👋
2025/08/15 15:16:50 [MESSAGE] Channel: general | User: TestUser | Content: Hello everyone!
2025/08/15 15:17:00 [SIMULATED] Channel: general | User: Developer (ID: 550e8400-e29b-41d4-a716-446655440002) | Content: Anyone else working on Go projects?
2025/08/15 15:17:10 [DISCONNECT] User: TestUser | Channel: general | Total clients: 0
```

This logging makes it easy to monitor server activity, debug issues, and understand message flow patterns.

## Frontend Console Logging

The test client also provides detailed logging in the browser's developer console:

### Frontend Log Types

- **`[FRONTEND-CONNECT]`**: Connection attempts and successful connections
- **`[FRONTEND-DISCONNECT]`**: User-initiated disconnections and connection closures
- **`[FRONTEND-MESSAGE]`**: All incoming messages in pretty-printed JSON format
- **`[FRONTEND-SEND]`**: Outgoing messages in JSON format before sending
- **`[FRONTEND-ERROR]`**: Connection errors and failures

### Example Browser Console Output

```javascript
[FRONTEND-CONNECT] Attempting to connect to: ws://localhost:8080/ws?username=TestUser&channel=general
[FRONTEND-CONNECT] Connected to WebSocket as TestUser in channel general
[FRONTEND-MESSAGE] {
  "type": "system",
  "username": "System",
  "content": "Welcome to the chat!",
  "timestamp": "2025-08-15T15:20:00Z",
  "channel": "general"
}
[FRONTEND-MESSAGE] {
  "type": "message",
  "username": "ChatBot",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "content": "Welcome to the chat! 👋",
  "timestamp": "2025-08-15T15:20:10Z",
  "channel": "general"
}
[FRONTEND-SEND] {
  "type": "message",
  "content": "Hello everyone!"
}
[FRONTEND-MESSAGE] {
  "type": "message",
  "username": "TestUser",
  "content": "Hello everyone!",
  "timestamp": "2025-08-15T15:20:15Z",
  "channel": "general"
}
[FRONTEND-DISCONNECT] User initiated disconnect
[FRONTEND-DISCONNECT] Connection closed. Code: 1000, Reason: 
```

### How to View Frontend Logs

1. Open the test client: `http://localhost:6969/`
2. Press `F12` or right-click → "Inspect" → "Console" tab
3. Connect to the chat and watch the console for detailed logging
4. All WebSocket activity will be logged with clear prefixes

This dual logging (server + frontend) provides complete visibility into the WebSocket communication flow.

## API Endpoints

### WebSocket Connection
- **Endpoint:** `ws://localhost:8080/ws`
- **Query Parameters:**
  - `username` (optional): Display name for the user (default: "Anonymous")
  - `channel` (optional): Channel name to join (default: "general")

**Example:**
```
ws://localhost:8080/ws?username=JohnDoe&channel=general
```

### HTTP Endpoints

#### Health Check
- **Endpoint:** `GET /health`
- **Response:** JSON status of the server

#### Statistics
- **Endpoint:** `GET /stats`
- **Response:** JSON with current connection count

#### Web Interface
- **Endpoint:** `GET /`
- **Response:** Simple HTML page with usage instructions

#### Test Client
- **Endpoint:** `GET /test`
- **Response:** Interactive HTML test client with WebSocket functionality

#### Static Files
- **Endpoint:** `GET /static/styles.css`
- **Response:** CSS stylesheet for the test client

## Message Format

### Incoming Messages (Client to Server)
```json
{
  "type": "message",
  "content": "Hello, world!"
}
```

### Outgoing Messages (Server to Client)
```json
{
  "type": "message",
  "username": "JohnDoe",
  "content": "Hello, world!",
  "timestamp": "2024-01-01T00:00:00Z",
  "channel": "general"
}
```

### Message Types
- `message`: Regular chat message
- `system`: System notification (welcome messages, etc.)

## Usage Examples

### Using WebSocket Client (JavaScript)

```javascript
const ws = new WebSocket('ws://localhost:8080/ws?username=TestUser&channel=general');

ws.onopen = function(event) {
    console.log('Connected to server');
};

ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    console.log(`${message.username}: ${message.content}`);
};

// Send a message
ws.send(JSON.stringify({
    type: 'message',
    content: 'Hello, everyone!'
}));
```

### Using curl for HTTP endpoints

```bash
# Health check
curl http://localhost:8080/health

# Get statistics
curl http://localhost:8080/stats
```

## Testing the Server

1. **Start the server:**
   ```bash
   go run main.go
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:8080
   ```

3. **Test WebSocket connection using browser developer tools:**
   ```javascript
   const ws = new WebSocket('ws://localhost:8080/ws?username=TestUser');
   ws.onmessage = (e) => console.log(JSON.parse(e.data));
   ws.send(JSON.stringify({type: 'message', content: 'Hello!'}));
   ```

## Architecture

- **Hub**: Central message broker that manages all client connections
- **Client**: Represents individual WebSocket connections
- **Message**: Data structure for chat messages
- **Channels**: Logical separation of conversations

## Development

### Project Structure
```
kabawDiscord/
├── .gitignore           # Git ignore file for build artifacts and dependencies
├── main.go              # Main server implementation
├── go.mod               # Go module definition
├── package.json         # npm configuration for HTTP server
├── index.html           # Default route for npm server (copy of test client)
├── styles.css           # CSS styles for test client
├── test_client.html     # Interactive HTML test client
└── README.md            # This file

# Ignored by .gitignore:
# ├── node_modules/        # npm dependencies
# ├── package-lock.json    # npm lock file
# ├── kabaw-discord        # compiled Go binary
# └── *.log                # log files
```

### Key Components

1. **Hub**: Manages client connections and message broadcasting
2. **Client**: Handles individual WebSocket connections
3. **Message Handling**: JSON-based message protocol
4. **Channel System**: Basic channel separation for messages

## Configuration

The server runs on port 8080 by default. To change the port, modify the `port` variable in `main.go`:

```go
port := ":8080"  // Change this to your desired port
```

## Limitations

- No message persistence (messages are not stored)
- No authentication system
- Basic channel system (no permissions)
- Simplified timestamp handling
- No rate limiting


## License

This is a simple example project for educational purposes.
