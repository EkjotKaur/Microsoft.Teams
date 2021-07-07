const User = require("../model/userModel");

let users = [];

let usersTeam = [];
let teams = [];

const addUserTeam = ({ userId, socketID, teamsId, name }) => {
  const user = usersTeam.find((user) => user.userId === userId);
  if (user) {
    user.teamsId = teamsId;
  } else {
    usersTeam.push({ userId, socketID, teamsId, name });
  }
  // !usersTeam.some((user) => user.userId === userId) &&
    // usersTeam.push({ userId, socketID, teamsId, name });
};

const removeUserTeam = (socketId) => {
  usersTeam = usersTeam.filter((user) => user.socketID !== socketId);
};

const getUserTeam = (userId) =>
  usersTeam.find((user) => user.userId === userId);

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId === userId);

module.exports = (io) => {
  io.on("connection", (socket) => {
    // When Connected
    console.log("user connected");
    socket.on("addUserToChat", (userId) => {
      addUser(userId, socket.id);
      console.log(users, "users");
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      const reciever = getUser(receiverId);
      let sender;
      try {
        sender = await User.findById(senderId);
      } catch (err) {
        console.log(err);
      }

      io.to(reciever.socketId).emit("getMessage", {
        sender: sender,
        text,
      });
    });

    socket.on("add user to teams", ({ userId, name, teamsId }) => {
      addUserTeam({
        userId,
        socketID: socket.id,
        teamsId: teamsId,
        name: name,
      });
      //   console.log(users, "users");
      //   io.emit("getUsers", users);
      socket.join(teamsId);
      console.log(teamsId);
    });

    socket.on("sendMessageToTeams", async ({ senderId, text }) => {
      const sender = getUserTeam(senderId);
      //   let sender;
      //   try {
      //     sender = await User.findById(senderId);
      //   } catch (err) {
      //     console.log(err);
      //   }
      console.log(sender.teamsId);
      socket.broadcast.to(sender.teamsId).emit("getMessageFromTeams", {
        sender: sender,
        text,
        // room: sender.teamsId,
      });
    });

    // When Disconnected
    socket.on("disconnect", () => {
      console.log("a user disconnected");
      removeUser(socket.id);
      removeUserTeam(socket.id);
      io.emit("getUsers", users);
    });
  });
};
