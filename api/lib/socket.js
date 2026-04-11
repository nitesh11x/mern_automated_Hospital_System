import { Server } from "socket.io";

export let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join_appointment_room", ({ appointmentId, userId, peerId }) => {
      socket.join(appointmentId);
      console.log(`User ${userId} joined room ${appointmentId}`);
      socket.to(appointmentId).emit("user_joined", { userId, peerId });
    });

    socket.on("join_admin_room", () => {
      socket.join("admin_room");
      console.log("Admin joined the global alert room");
    });

    socket.on("send_message", ({ appointmentId, content, senderId, senderName, senderType }) => {
      // Broadcast to other users in the room
      const msgPayload = {
        _id: new Date().getTime().toString(), // Temp ID for immediate render
        appointmentId,
        content,
        senderId,
        senderName,
        senderType,
        createdAt: new Date(),
      };
      socket.to(appointmentId).emit("receive_message", msgPayload);
    });

    // --- WebRTC / PeerJS Signaling (if needed manually, but PeerJS has its own server; 
    // we just use this to trigger the call UI)
    socket.on("call_user", ({ appointmentId, callerId, peerId, callerName }) => {
      console.log(`User ${callerId} is calling in room ${appointmentId} with PeerID ${peerId}`);
      socket.to(appointmentId).emit("incoming_call", { callerId, peerId, callerName });
    });

    socket.on("end_call", ({ appointmentId, senderId }) => {
      socket.to(appointmentId).emit("call_ended", { senderId });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
