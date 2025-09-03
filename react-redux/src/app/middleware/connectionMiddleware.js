export const connectionMiddleware = (store) => {
  let ws = null;

  return (next) => (action) => {
    const { dispatch, getState } = store;

    if (action.type === "connection/setConnected") {
      const { username, channel } = getState().user;
      const wsUrl = `ws://localhost:8080/ws?username=${encodeURIComponent(
        username
      )}&channel=${encodeURIComponent(channel)}`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        // Optionally dispatch an action on open
        console.log("WebSocket connected");
      };

      ws.onclose = () => {
        dispatch({ type: "connection/setDisconnected" });
        ws = null;
        console.log("WebSocket disconnected");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        dispatch({ type: "connection/setDisconnected" });
      };

      ws.onmessage = (event) => {
        // Optionally dispatch actions with received data
        // dispatch({ type: 'chat/messageReceived', payload: JSON.parse(event.data) });
      };
    }

    if (action.type === "connection/setDisconnected") {
      if (ws) {
        ws.close();
        ws = null;
      }
    }

    return next(action);
  };
};
