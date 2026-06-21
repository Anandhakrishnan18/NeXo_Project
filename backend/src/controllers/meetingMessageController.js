const MeetingMessage = require(
  "../models/MeetingMessage"
);

const getMeetingMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await MeetingMessage.find({
        meetingId:
          req.params.meetingId,
      })
        .populate(
          "sender",
          "username email"
        )
        .sort({
          createdAt: 1,
        });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMeetingMessages,
};