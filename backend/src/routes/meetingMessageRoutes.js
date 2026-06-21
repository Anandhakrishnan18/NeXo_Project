const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  getMeetingMessages,
} = require(
  "../controllers/meetingMessageController"
);

router.get(
  "/:meetingId",
  protect,
  getMeetingMessages
);

module.exports = router;