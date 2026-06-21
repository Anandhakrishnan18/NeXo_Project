const TeamMessage = require(
  "../models/TeamMessage"
);

const teamChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `User Connected: ${socket.id}`
    );

    socket.on("join-team", (teamId) => {
      socket.join(teamId);

      console.log(
        `${socket.id} joined team ${teamId}`
      );
    });

    socket.on(
      "send-message",
      async (data) => {
        try {
          const message =
            await TeamMessage.create({
              teamId: data.teamId,
              sender: data.senderId,
              content: data.content,
            });

          const populatedMessage =
            await TeamMessage.findById(
              message._id
            ).populate(
              "sender",
              "username email"
            );

          io.to(data.teamId).emit(
            "receive-message",
            populatedMessage
          );
        } catch (error) {
          console.error(error);
        }
      }
    );

    socket.on(
      "leave-team",
      (teamId) => {
        socket.leave(teamId);
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          `User Disconnected: ${socket.id}`
        );
      }
    );
  });
};

module.exports = teamChatSocket;