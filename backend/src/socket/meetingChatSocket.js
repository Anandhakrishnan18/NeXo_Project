const MeetingMessage = require(
  "../models/MeetingMessage"
);

const meetingChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `Meeting User Connected: ${socket.id}`
    );

    socket.on(
      "join-meeting",
      (meetingId) => {

        console.log(
  socket.id,
  "joined meeting",
  meetingId
);

        socket.join(meetingId);

        console.log(
          `${socket.id} joined meeting ${meetingId}`
        );
      }
    );

    socket.on(
      "send-meeting-message",
      async (data) => {
        try {
          const message =
            await MeetingMessage.create({
              meetingId:
                data.meetingId,
              sender:
                data.senderId,
              content:
                data.content,
            });

          const populatedMessage =
            await MeetingMessage.findById(
              message._id
            ).populate(
              "sender",
              "username email"
            );

          io.to(
            data.meetingId
          ).emit(
            "receive-meeting-message",
            populatedMessage
          );
        } catch (error) {
          console.error(error);
        }
      }
    );

    socket.on(
      "leave-meeting",
      (meetingId) => {
        socket.leave(meetingId);
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          `Meeting User Disconnected: ${socket.id}`
        );
      }
    );
  });
};

module.exports =
  meetingChatSocket;