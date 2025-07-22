import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    updateChat: (state, action) => {
      const index = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      );
      if (index !== -1) {
        state.chats[index] = action.payload;
      } else {
        state.chats.unshift(action.payload);
      }
    },
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    resetChatState: () => ({
      chats: [],
      selectedChat: null,
    }),
    markAsRead: (state, action) => {
      const chat = state.chats.find((c) => c._id === action.payload);
      if (chat) {
        chat.unread = false; // if you're tracking unread state per chat
      }
    },
  },
});

export const { setChats, updateChat, selectChat, resetChatState } =
  chatSlice.actions;
export default chatSlice.reducer;
