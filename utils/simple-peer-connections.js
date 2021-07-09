const users = {};

const socketToRoom = {};

// const users = [];
// const rooms = {}
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connected");
    socket.on("join room", ({ roomID, name, userId }) => {
      if (users[roomID]) {
        const length = users[roomID].length;
        if (length === 4) {
          socket.emit("room full");
          return;
        }
        users[roomID].push({
          id: socket.id,
          name,
          userId,
          constraints: { video: true, audio: true },
        });
        // users.push(roomID, )
      } else {
        users[roomID] = [
          {
            id: socket.id,
            name,
            userId,
            constraints: { video: true, audio: true },
          },
        ];
      }
      console.log(users, "USERS");
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter(
        (user) => user.id !== socket.id
      );

      socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", (payload) => {
      io.to(payload.userToSignal).emit("user joined", {
        signal: payload.signal,
        callerID: payload.callerID,
        constraints: payload.constraints,
        name: payload.name,
      });
    });

    socket.on("returning signal", (payload) => {
      io.to(payload.callerID).emit("receiving returned signal", {
        signal: payload.signal,
        id: socket.id,
        constraints: payload.constraints,
        name: payload.name,
      });
    });

    socket.on("videoOff", (payload) => {
      const USER = users[payload.roomID].find((user) => user.id === socket.id);

      // USER.constraints.video = payload.constraints.video;
      USER.constraints = payload.constraints;
      console.log(USER);
      console.log(users[payload.roomID]);
      if (payload.constraints.video === false) {
        socket.broadcast.emit("user videoOff", {
          id: payload.id,
          user: USER,
          constraints: payload.constraints,
        });
      } else {
        socket.broadcast.emit("user videoOn", {
          id: payload.id,
          user: USER,
          constraints: payload.constraints,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("peer disconnect");
      const roomID = socketToRoom[socket.id];
      console.log(socket.id, "socketID");
      console.log(socketToRoom, "socketTOROOM");
      let room = users[roomID];
      console.log(room, "room");
      if (room) {
        room = room.filter((user) => user.id !== socket.id);
        users[roomID] = room;
      }
      socket.broadcast.emit("user left", socket.id);
      console.log(users);
    });
  });
};
