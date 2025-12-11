const WebSocket = require("ws");
const readline = require("readline");

const username = "jastin";
const channel = "general";

const SOCKET_URL = `ws://localhost:8080/ws?username=${username}&channel=${channel}`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket(SOCKET_URL);

ws.on("open", () => {
  console.log("Connected to Kabaw WebSocket");
  console.log(`Joined channel "${channel}" as ${username}`);
  askMessage();
});

ws.on("message", (data) => {
  console.log("Message:", data.toString());
});

ws.on("close", () => {
  console.log(" Connection closed by server");
  process.exit(0);
});

ws.on("error", (err) => {
  console.error("WebSocket error:", err.message);
});

function askMessage() {
  rl.question("You: ", (msg) => {
    if (!msg.trim()) {
      askMessage();
      return;
    }

    ws.send(msg);

    askMessage();
  });
}
