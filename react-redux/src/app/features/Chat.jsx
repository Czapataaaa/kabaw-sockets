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
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
