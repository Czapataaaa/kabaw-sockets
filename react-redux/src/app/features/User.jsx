import { createSlice } from "@reduxjs/toolkit";

const initiaState = {
  username: "",
  userId: null,
  channel: "general",
};

const userSlice = createSlice({
  name: "user",
  initialState: initiaState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setChannel: (state, action) => {
      state.channel = action.payload;
    },
    clearUser: (state) => {
      state.username = "";
      state.userId = null;
      state.channel = "general";
    },
  },
});

export const { setUsername, setUserId, setChannel, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
