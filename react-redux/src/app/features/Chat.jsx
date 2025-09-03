import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.message.push(action.payload);
    },
    clearMessages: (state) => {
      state.message = [];
    },
    sendMessage: (state, action) => {
      // This reducer does not change state, it's just for middleware
    },
  },
});

export const { addMessage, clearMessages, sendMessage } = chatSlice.actions;
export default chatSlice.reducer;
