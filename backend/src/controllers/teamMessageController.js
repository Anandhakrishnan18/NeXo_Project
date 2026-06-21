const TeamMessage = require("../models/TeamMessage");

const getTeamMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await TeamMessage.find({
        teamId: req.params.teamId,
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

const sendTeamMessage = async (
  req,
  res
) => {
  try {
    const { teamId, content } =
      req.body;

    const message =
      await TeamMessage.create({
        teamId,
        sender: req.user.id,
        content,
      });

    const populatedMessage =
      await TeamMessage.findById(
        message._id
      ).populate(
        "sender",
        "username email"
      );

    res.status(201).json(
      populatedMessage
    );

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTeamMessages,
  sendTeamMessage,
};