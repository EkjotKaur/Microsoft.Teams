// user for each room
const users = {};
// structure of user object
// user = {
//  roomId: [user1, user2, user3]
// }

// rooms for userId (socket.id)
const socketToRoom = {};
// socketToRoom ={
//  user1Id: room1Id
//  user2Id: room2Id
//  user3Id: room1Id
// }

// export this function
module.exports = (io) => {
  // Connection to socket.io
  io.on("connection", (socket) => {
    console.log("connected");

    // When the user joins the room (client to server)
    socket.on("join room", ({ roomID, name, userId }) => {
      // Checking if roomID is exists
      if (users[roomID]) {
        // Checking if the room is filled or not
        const length = users[roomID].length;
        if (length === 4) {
          // Sending a response that room is full
          socket.emit("room full");
          return;
        }
        // If the room is not filled push it in the room array in user object
        users[roomID].push({
          id: socket.id,
          name,
          userId,
          constraints: { video: true, audio: true },
        });
      } else {
        // If the room doesn't exists in the user object
        // create new array in user object
        users[roomID] = [
          {
            id: socket.id,
            name,
            userId,
            constraints: { video: true, audio: true },
          },
        ];
      }

      // adding roomID to socket.id in socketToRoom array
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter(
        (user) => user.id !== socket.id
      );

      // Sending all users to the client side  (to all the users)
      socket.emit("all users", usersInThisRoom);
    });

    // When signal is being sent to the other user (client to server)
    socket.on("sending signal", (payload) => {
      io.to(payload.userToSignal).emit("user joined", {
        signal: payload.signal,
        callerID: payload.callerID,
        constraints: payload.constraints,
        name: payload.name,
      });
    });

    // When signal is returning from the other user (client to server)
    socket.on("returning signal", (payload) => {
      io.to(payload.callerID).emit("receiving returned signal", {
        signal: payload.signal,
        id: socket.id,
        constraints: payload.constraints,
        name: payload.name,
      });
    });

    // When the audio is turn off or turned On (client to server)
    socket.on("videoOff", (payload) => {
      // finding users with the socket.id in room
      const USER = users[payload.roomID].find((user) => user.id === socket.id);

      // updating the user audio and video constraints
      USER.constraints = payload.constraints;

      // When video is turned off
      if (payload.constraints.video === false) {
       // Sending the data to all the users accepted the user itself (server to the client side)
        socket.broadcast.emit("user videoOff", {
          id: payload.id,
          user: USER,
          constraints: payload.constraints,
        });
      } else {
        // When video is turned on
        // Sending the data to all the users accepted the user itself (server to the client side
        socket.broadcast.emit("user videoOn", {
          id: payload.id,
          user: USER,
          constraints: payload.constraints,
        });
      }
    });

    // When the user disconnects from the video call (room)
    socket.on("disconnect", () => {
      console.log("peer disconnect");

      // Searching the room for the disconnted user
      const roomID = socketToRoom[socket.id];

      // searching the room array from users object with the roomID
      let room = users[roomID];

      // If room is found
      if (room) {
        // Remove the user from the array
        room = room.filter((user) => user.id !== socket.id);
        users[roomID] = room;
      }
      // Sending to all the user accept the user itself the response that the user disconnected
      socket.broadcast.emit("user left", socket.id);
    });
  });
};
