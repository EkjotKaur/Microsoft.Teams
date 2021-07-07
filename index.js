// requiring modules and setting up app and socket.io
require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
  cors: "*",
});

const cors = require("cors");

const mongoose = require("mongoose");

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(cors());

console.log(process.env.MONGOURI);

// connecting to mongoDB
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

// requiring socket for simple peer connections
require("./utils/simple-peer-connections")(io);
require("./utils/socket-connections")(io);
// require("./utils/socket-connections-for-teams")(io);

const userRouter = require("./router/userRouter");
const conversationRouter = require("./router/conversationRouter");
const messageRouter = require("./router/messageRouter");
const teamsMessageRouter = require("./router/teamsMessageRouter");
const teamsRouter = require("./router/teamsRouter");

app.use("/api/user", userRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/messageTeams", teamsMessageRouter);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Listening
server.listen(process.env.PORT || 5000, () =>
  console.log("server is running on port 5000")
);
