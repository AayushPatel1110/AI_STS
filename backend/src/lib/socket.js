import { Server } from "socket.io";
import { createServer } from "http";

export let io;
export const userSocketMap = {}; // {userId: socketId}

export const initializeSocket = (app) => {
  const httpServer = createServer(app);

  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"]
    : true; // fallback: allow all (safe for dev, set FRONTEND_URL in Render for prod)

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    },
    // Must list transports explicitly for Render cloud hosting
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      if (userId) delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return httpServer;
};
