const generateInviteCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "NEXO-";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return code;
};


const Team = require("../models/Team");

const createTeam = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    const team = await Team.create({
      name,
      description,
      visibility,
      inviteCode:
        visibility === "private"
          ? generateInviteCode()
          : null,
      owner: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("owner", "username email")
      .populate("members", "username email");

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("owner", "username email")
      .populate("members", "username email");

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const joinTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (team.visibility !== "public") {
      return res.status(400).json({
        message: "Use invite code",
      });
    }

    if (
      team.members.includes(req.user.id)
    ) {
      return res.status(400).json({
        message: "Already a member",
      });
    }

    team.members.push(req.user.id);

    await team.save();

    res.status(200).json({
      message: "Joined team successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const joinPrivateTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const team = await Team.findOne({
      inviteCode,
    });

    if (!team) {
      return res.status(404).json({
        message: "Invalid invite code",
      });
    }

    if (
      team.members.includes(req.user.id)
    ) {
      return res.status(400).json({
        message: "Already a member",
      });
    }

    team.members.push(req.user.id);

    await team.save();

    res.status(200).json({
      message: "Joined private team",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const leaveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    team.members = team.members.filter(
      (member) =>
        member.toString() !== req.user.id
    );

    await team.save();

    res.status(200).json({
      message: "Left team successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  joinTeam,
  joinPrivateTeam,
  leaveTeam,
};