import type { WSState, WSAction } from "./websocket";
import { WS_ACTIONS } from "./websocket";

// Initial state
export const initialState: WSState = {
  ws: null,
  isConnected: false,
  connectionStatus: "Disconnected",
  username: "",
  userID: null,
  channel: "",
  messages: [],
};

// Reducer function
export function webSocketReducer(state: WSState, action: WSAction): WSState {
  switch (action.type) {
    case WS_ACTIONS.SET_CONNECTION_STATUS:
      return {
        ...state,
        isConnected: action.payload.isConnected,
        connectionStatus: action.payload.status,
      };

    case WS_ACTIONS.SET_USER_INFO:
      return {
        ...state,
        username: action.payload.username,
        userID: action.payload.userID,
        channel: action.payload.channel,
      };

    case WS_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case WS_ACTIONS.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };

    case WS_ACTIONS.SET_WEBSOCKET:
      return {
        ...state,
        ws: action.payload,
      };

    default:
      return state;
  }
}
