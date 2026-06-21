const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTeam,
  getTeams,
  getTeamById,
  joinTeam,
  joinPrivateTeam,
  leaveTeam,
} = require("../controllers/teamController");

router.post("/", protect, createTeam);

router.get("/", protect, getTeams);

router.get("/:id", protect, getTeamById);

router.post("/:id/join", protect, joinTeam);

router.post("/join-private", protect, joinPrivateTeam);

router.post("/:id/leave", protect, leaveTeam);

module.exports = router;