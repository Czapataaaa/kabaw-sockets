import { useContext } from "react";
import { WebSocketContext } from "../context/websocketProvider";
import type { WSContextValue, WSMessage } from "../context/websocket";

/**
 * Custom hook to use WebSocket functionality
 * Must be used within a WebSocketProvider
 *
 * @returns {WSContextValue} WebSocket state and methods
 * @throws {Error} If used outside WebSocketProvider
 */
export function useWebSocket(): WSContextValue {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  return context;
}

/**
 * Hook for connection-related functionality
 * Provides only connection methods and status
 */
export function useWebSocketConnection() {
  const {
    isConnected,
    connectionStatus,
    username,
    userID,
    channel,
    connect,
    disconnect,
  } = useWebSocket();

  return {
    isConnected,
    connectionStatus,
    username,
    userID,
    channel,
    connect,
    disconnect,
  };
}

/**
 * Hook for message-related functionality
 * Provides only message methods and data
 */
export function useWebSocketMessages() {
  const { messages, sendMessage, clearMessages, isConnected, username } =
    useWebSocket();

  return {
    messages,
    sendMessage,
    clearMessages,
    isConnected,
    username,
  };
}

/**
 * Hook for WebSocket status information
 * Provides read-only status data
 */
export function useWebSocketStatus() {
  const { isConnected, connectionStatus, username, userID, channel, messages } =
    useWebSocket();

  return {
    isConnected,
    connectionStatus,
    username,
    userID,
    channel,
    messageCount: messages.length,
    lastMessage: (messages[messages.length - 1] ?? null) as WSMessage | null,
  };
}
