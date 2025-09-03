import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
  error: null,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnected: (state) => {
      state.connected = true;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.connected = false;
    },
    setConnectionError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setConnected, setDisconnected, setConnectionError } =
  connectionSlice.actions;
export default connectionSlice.reducer;
