import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/User";
import connectionReducer from "./features/Connection";
import chatReducer from "./features/Chat";
import { connectionMiddleware } from "./middleware/connectionMiddleware";

export const Store = configureStore({
  reducer: {
    user: userReducer,
    connection: connectionReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(connectionMiddleware),
});
