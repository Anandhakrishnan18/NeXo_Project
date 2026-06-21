const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createMeeting,
  getMeetings,
  getMeetingById,
  joinMeeting,
} = require(
  "../controllers/meetingController"
);

router.post(
  "/",
  protect,
  createMeeting
);

router.get(
  "/",
  protect,
  getMeetings
);

router.get(
  "/:id",
  protect,
  getMeetingById
);

router.post(
  "/:id/join",
  protect,
  joinMeeting
);

module.exports = router;