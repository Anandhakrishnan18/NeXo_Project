const webrtcSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `WebRTC User Connected: ${socket.id}`
    );

    // Join Video Room
    socket.on(
      "join-video-room",
      (roomId) => {
        socket.join(roomId);

        socket
          .to(roomId)
          .emit(
            "user-joined",
            socket.id
          );

        console.log(
          `${socket.id} joined video room ${roomId}`
        );
      }
    );

    // Offer
    socket.on(
      "offer",
      ({
        roomId,
        offer,
      }) => {
        socket
          .to(roomId)
          .emit(
            "offer",
            {
              offer,
              senderId:
                socket.id,
            }
          );
      }
    );

    // Answer
    socket.on(
      "answer",
      ({
        roomId,
        answer,
      }) => {
        socket
          .to(roomId)
          .emit(
            "answer",
            {
              answer,
              senderId:
                socket.id,
            }
          );
      }
    );

    // ICE Candidate
    socket.on(
      "ice-candidate",
      ({
        roomId,
        candidate,
      }) => {
        socket
          .to(roomId)
          .emit(
            "ice-candidate",
            {
              candidate,
              senderId:
                socket.id,
            }
          );
      }
    );

    // Leave Room
    socket.on(
      "leave-video-room",
      (roomId) => {
        socket.leave(roomId);

        socket
          .to(roomId)
          .emit(
            "user-left",
            socket.id
          );
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          `WebRTC User Disconnected: ${socket.id}`
        );
      }
    );
  });
};

module.exports = webrtcSocket;