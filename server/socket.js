const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://kanban-kappa-jet.vercel.app",
        process.env.CLIENT_URL,
      ].filter(Boolean),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_user", (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on("join_board", (boardId) => {
      if (boardId) {
        socket.join(`board:${boardId}`);
      }
    });

    socket.on("leave_board", (boardId) => {
      if (boardId) {
        socket.leave(`board:${boardId}`);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
