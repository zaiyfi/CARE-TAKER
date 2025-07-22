// src/socket.js

import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  autoConnect: false, // so you can control when to connect
});

export default socket;
