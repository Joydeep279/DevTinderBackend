const socket = require("socket.io");

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FrontendURL,
    },
  });

  io.on("connect", (socket) => {
    socket.on("joinChat", ({ toUserId, fromUserId }) => {
      const uniqueRoomId = [toUserId, fromUserId].sort().join("-");
      socket.join(uniqueRoomId);
    });
    socket.on("sendMsg", ({ name, toUserId, fromUserId, sendMsg }) => {
      const uniqueRoomId = [toUserId, fromUserId].sort().join("-");
      socket.to(uniqueRoomId).emit("roomMsg", { name, sendMsg });
    });
    socket.on("leaveChat", () => {
      
    });
  });

  return io;
};
module.exports = initialiseSocket;
