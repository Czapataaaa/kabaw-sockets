import { createContext, useReducer, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { WS_ACTIONS } from "./websocket";
import type { WSContextValue } from "./websocket";
import { webSocketReducer, initialState } from "./WebSocketReducer";

export const WebSocketContext = createContext<WSContextValue | undefined>(
  undefined
);

// Props
interface WebSocketProviderProps {
  children: ReactNode;
}

// Provider Component
export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [state, dispatch] = useReducer(webSocketReducer, initialState);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = (username: string, channel: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("[WS] Already connected");
      return;
    }

    const wsUrl = `ws://localhost:8080/ws?username=${encodeURIComponent(
      username
    )}&channel=${encodeURIComponent(channel)}`;
    console.log(`[WS-CONNECT] Attempting to connect to: ${wsUrl}`);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      dispatch({ type: WS_ACTIONS.SET_WEBSOCKET, payload: ws });

      ws.onopen = () => {
        console.log(
          `[WS-CONNECT] Connected as ${username} in channel ${channel}`
        );
        dispatch({
          type: WS_ACTIONS.SET_CONNECTION_STATUS,
          payload: { isConnected: true, status: "Connected" },
        });
        dispatch({
          type: WS_ACTIONS.SET_USER_INFO,
          payload: { username, userID: null, channel },
        });
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        dispatch({
          type: WS_ACTIONS.ADD_MESSAGE,
          payload: {
            id: Date.now() + Math.random(),
            type: message.type,
            username: message.username,
            content: message.content,
            timestamp: message.timestamp,
          },
        });
      };

      ws.onclose = (event) => {
        console.log(`[WS-DISCONNECT] Connection closed. Code: ${event.code}`);
        dispatch({
          type: WS_ACTIONS.SET_CONNECTION_STATUS,
          payload: { isConnected: false, status: "Disconnected" },
        });
        dispatch({
          type: WS_ACTIONS.SET_USER_INFO,
          payload: { username: "", userID: null, channel: "" },
        });
        wsRef.current = null;
      };

      ws.onerror = (error) => {
        console.error("[WS-ERROR] WebSocket error:", error);
      };
    } catch (error) {
      console.error("[WS-ERROR] Failed to connect:", error);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      console.log("[WS-DISCONNECT] User initiated disconnect");
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const sendMessage = (content: string) => {
    if (
      content.trim() &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      const message = { type: "message", content: content.trim() };
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const clearMessages = () => {
    dispatch({ type: WS_ACTIONS.CLEAR_MESSAGES });
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const value: WSContextValue = {
    ...state,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
