const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  getTeamMessages,
  sendTeamMessage,
} = require(
  "../controllers/teamMessageController"
);

router.get(
  "/:teamId",
  protect,
  getTeamMessages
);

router.post(
  "/",
  protect,
  sendTeamMessage
);

module.exports = router;