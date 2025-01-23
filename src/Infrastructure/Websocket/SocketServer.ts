import { Server } from "socket.io";

let io: Server;

export const initSocketServer = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("Client Connected", socket.id);

    socket.emit("test-event", { message: "Connection successful" });

    socket.on("message", (data) => {
      console.log("Received message:", data);
      socket.emit("echo", {
        message: "Server received: " + JSON.stringify(data),
      });
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected (${reason})`, socket.id);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  io.engine.on("connection_error", (err) => {
    console.log("Connection error details:");
    console.log("  Request:", err.req?.url);
    console.log("  Code:", err.code);
    console.log("  Message:", err.message);
    console.log("  Context:", err.context);
  });

  return io;
};

export const getSocketInstance = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
};
