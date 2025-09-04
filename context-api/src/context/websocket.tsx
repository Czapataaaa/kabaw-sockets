// Message type
export interface WSMessage {
  id: number;
  type: string;
  username: string;
  content: string;
  timestamp: string;
}

// State type
export interface WSState {
  ws: WebSocket | null;
  isConnected: boolean;
  connectionStatus: string;
  username: string;
  userID: string | null;
  channel: string;
  messages: WSMessage[];
}

// Action types
export const WS_ACTIONS = {
  SET_CONNECTION_STATUS: "SET_CONNECTION_STATUS",
  SET_USER_INFO: "SET_USER_INFO",
  ADD_MESSAGE: "ADD_MESSAGE",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
  SET_WEBSOCKET: "SET_WEBSOCKET",
} as const;

// Action type definitions
export type WSAction =
  | {
      type: typeof WS_ACTIONS.SET_CONNECTION_STATUS;
      payload: { isConnected: boolean; status: string };
    }
  | {
      type: typeof WS_ACTIONS.SET_USER_INFO;
      payload: { username: string; userID: string | null; channel: string };
    }
  | { type: typeof WS_ACTIONS.ADD_MESSAGE; payload: WSMessage }
  | { type: typeof WS_ACTIONS.CLEAR_MESSAGES }
  | { type: typeof WS_ACTIONS.SET_WEBSOCKET; payload: WebSocket | null };

// Context value type
export interface WSContextValue extends WSState {
  connect: (username: string, channel: string) => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
}
