const whiteboardSocket = (io) => {
  io.on("connection", (socket) => {

    socket.on(
      "join-whiteboard",
      (meetingId) => {
        socket.join(
          `whiteboard-${meetingId}`
        );
      }
    );

    socket.on(
      "draw",
      (data) => {
        socket
          .to(
            `whiteboard-${data.meetingId}`
          )
          .emit(
            "draw",
            data
          );
      }
    );

    socket.on(
      "clear-board",
      (meetingId) => {
        socket
          .to(
            `whiteboard-${meetingId}`
          )
          .emit(
            "clear-board"
          );
      }
    );
  });
};

module.exports =
  whiteboardSocket;