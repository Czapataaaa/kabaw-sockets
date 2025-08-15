# Kabaw Discord WebSocket Server

A simple Go WebSocket server for real-time messaging, similar to Discord. This server provides a basic chat system with support for multiple channels and users.

## Features

- Real-time messaging via WebSockets
- Multiple channel support
- User identification
- Connection statistics
- Health check endpoint
- Simple web interface for testing

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
├── main.go              # Main server implementation
├── go.mod               # Go module definition
├── styles.css           # CSS styles for test client
├── test_client.html     # Interactive HTML test client
└── README.md            # This file
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
