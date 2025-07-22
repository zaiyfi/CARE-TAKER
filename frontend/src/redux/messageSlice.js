import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetMessages: () => ({
      messages: [],
    }),
  },
});

export const { setMessages, addMessage, resetMessages } = messageSlice.actions;
export default messageSlice.reducer;
