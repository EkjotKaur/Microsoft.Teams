const User = require("../model/userModel");

// Array for all the users in personal chat
let users = [];

// Array for all the users in team chat
let usersTeam = [];

// Function to add user to teams Video (userTeam Array)
const addUserTeam = ({ userId, socketID, teamsId, name }) => {
  const user = usersTeam.find((user) => user.userId === userId);
  if (user) {
    user.teamsId = teamsId;
  } else {
    usersTeam.push({ userId, socketID, teamsId, name });
  }
};

// Function to remove user from teams Video (userTeam Array)
const removeUserTeam = (socketId) => {
  usersTeam = usersTeam.filter((user) => user.socketID !== socketId);
};

// The Function to get user from userTeam Array
const getUserTeam = (userId) =>
  usersTeam.find((user) => user.userId === userId);

// Function to add user to one-to-one Video (user Array)
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

// Function to remove user from one-to-one Video (user Array)
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// The Function to get user from user Array
const getUser = (userId) => users.find((user) => user.userId === userId);

// This function is exported
module.exports = (io) => {
  // Connection to the socket.io
  io.on("connection", (socket) => {
    console.log("user connected");

    //**********************************************************************************************
    //**********************************************************************************************
    // Personal Chats
    //**********************************************************************************************

    // When Connected to personal chat (client to server)
    socket.on("addUserToChat", (userId) => {
      addUser(userId, socket.id);

      // Sending users to client
      io.emit("getUsers", users);
    });

    // When a message is send to a personal chat (client to server)
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      const reciever = getUser(receiverId);

      // Getting sender details from the DB;
      let sender;
      try {
        sender = await User.findById(senderId);
      } catch (err) {
        console.log(err);
      }

      // Sending the message to the other user (i.e from sender to reciever) (server to client)
      io.to(reciever.socketId).emit("getMessage", {
        sender: sender,
        text,
      });
    });

    //**********************************************************************************************
    //**********************************************************************************************
    // Teams Chats
    //**********************************************************************************************

    // When Connected to teams chat (client to server)
    socket.on("add user to teams", ({ userId, name, teamsId }) => {
      addUserTeam({
        userId,
        socketID: socket.id,
        teamsId: teamsId,
        name: name,
      });

      // user is joined to the team
      socket.join(teamsId);
    });

    // When a message is send to a team chat (client to server)
    socket.on("sendMessageToTeams", async ({ senderId, text }) => {
      const sender = getUserTeam(senderId);

      // Sending the message to the team (room with teamId) (i.e from sender to users in the team)
      //  (server to client)
      socket.broadcast.to(sender.teamsId).emit("getMessageFromTeams", {
        sender: sender,
        text,
      });
    });

    // When Disconnected
    socket.on("disconnect", () => {
      console.log("a user disconnected");
      
      // Removing user from user array
      removeUser(socket.id);

      // Removing user from userTeam array
      removeUserTeam(socket.id);
      io.emit("getUsers", users);
    });
  });
};
