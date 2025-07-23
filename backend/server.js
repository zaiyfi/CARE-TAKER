require("dotenv").config();

// importing modules
const express = require("express");
const mongoose = require("mongoose");

// Rquiring Routes
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const verificationRoutes = require("./routes/verificationRoutes");

const http = require("http");
const cors = require("cors");

// express app
const app = express();

// middleware

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/verify", verificationRoutes);

// Setup server and socket
const server = http.createServer(app);
require("./socket")(server); // pass server to socket.js

// listening to requests
const PORT = process.env.PORT;
server.listen(PORT, () => console.log("listening requests on port:", PORT));

// connecting to db
mongoose.connect(process.env.MONGO).then(() => {
  console.log("Connected to DB");
});
