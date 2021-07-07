const User = require("../model/userModel");

let users = [];
let teams = [];

const addUser = ({ userId, socketID, teamsId, name }) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketID, teamsId, name });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketID !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId === userId);

module.exports = (io) => {
  io.on("connection", (socket) => {
    // When Connected
    console.log("user connected");
    socket.on("add user to teams", ({ userId, name, teamsId }) => {
      addUser({ userId, socketID: socket.id, teamsId: teamsId, name: name });
      //   console.log(users, "users");
      //   io.emit("getUsers", users);
      socket.join(teamsId);
    });

    socket.on("sendMessageToTeams", async ({ senderId, text }) => {
      const sender = getUser(senderId);
      //   let sender;
      //   try {
      //     sender = await User.findById(senderId);
      //   } catch (err) {
      //     console.log(err);
      //   }

      socket.broadcast.to(sender.teamsId).emit("getMessageFromTeams", {
        sender: sender,
        text,
      });
    });

    // When Disconnected
    socket.on("disconnect", () => {
      console.log("a user disconnected");
      removeUser(socket.id);
      //   io.emit("getUsers", users);
    });
  });
};
