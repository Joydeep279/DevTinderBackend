const Socket = require("socket.io");
function initialiseSocket(httpServer) {
  const io = Socket(httpServer, {
    cors: {
      origin: process.env.FrontendURL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ fromUserId, toUserId }) => {
      const roomId = [fromUserId, toUserId].sort().join("_");
      socket.join(roomId);
    });
    socket.on("sendMsg", ({ fromUserName, fromUserId, toUserId, msg }) => {
      const roomId = [fromUserId, toUserId].sort().join("_");
      io.to(roomId).emit("RecievedMsg", {
        name: fromUserName,
        fromUserId,
        toUserId,
        msg,
      });
    });
    socket.on("leaveChat", () => {});
  });
}
module.exports = { initialiseSocket };
