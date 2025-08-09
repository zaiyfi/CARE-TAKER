import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { authSlice } from "./authSlice";
import { loaderSlice } from "./loaderSlice";
import { gigSlice } from "./gigSlice";
import { allUsersSlice } from "./UsersSlice";
import { userGigSlice } from "./userGigSlice";
import { notifSlice } from "./notifSlice";
import chatReducer from "./chatSlice";
import messageReducer from "./messageSlice";
import appointmentReducer from "./appointmentsSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const appReducer = combineReducers({
  auth: authSlice.reducer,
  loader: loaderSlice.reducer,
  gigs: gigSlice.reducer,
  userGigs: userGigSlice.reducer, // updated key
  users: allUsersSlice.reducer,
  notif: notifSlice.reducer,
  chat: chatReducer,
  message: messageReducer,
  appointment: appointmentReducer, // Ensure appointmentReducer is imported and added
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
