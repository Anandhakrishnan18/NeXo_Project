import Layout from "../components/Layout";
import "../styles/teams.css";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Teams() {

    const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

const [showModal, setShowModal] =
  useState(false);

  const [showJoinModal, setShowJoinModal] =
  useState(false);

const [inviteCode, setInviteCode] =
  useState("");

const [createdInviteCode,
  setCreatedInviteCode] =
  useState("");

const [name, setName] =
  useState("");

const [description, setDescription] =
  useState("");

const [visibility, setVisibility] =
  useState("public");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");

      setTeams(res.data);

    } catch (error) {
      console.log(error);
    }
  };

const createTeam = async () => {
  try {

    const res = await API.post(
  "/teams",
  {
    name,
    description,
    visibility,
  }
);


   if (
  res.data.visibility === "private"
) {
  setCreatedInviteCode(
    res.data.inviteCode
  );
}

    setShowModal(false);

    setName("");
    setDescription("");

    setVisibility("public");

    fetchTeams();

  } catch (error) {
    console.log(error);
  }
};

const joinPrivateTeam = async () => {
  try {

    await API.post(
      "/teams/join-private",
      {
        inviteCode,
      }
    );

    alert("Joined Team Successfully");

    setShowJoinModal(false);

    setInviteCode("");

    fetchTeams();

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to Join Team"
    );
  }
};

  return (
    <Layout>

      <div className="teams-header">

        <div>
          <h1>Teams</h1>

          <p>
            Organize your work into focused
            team workspaces.
          </p>
        </div>

        <div className="teams-actions">

          <button
  className="secondary-btn"
  onClick={() =>
    setShowJoinModal(true)
  }
>
  Join with code
</button>

          <button
  className="primary-btn"
  onClick={() =>
    setShowModal(true)
  }
>
  + Create Team
</button>

        </div>

      </div>

      <div className="team-tabs">

        <button className="active-tab">
          My Teams
        </button>

        <button>
          Public Teams
        </button>

      </div>

<div className="teams-grid">

  {teams.map((team) => (

<div
  key={team._id}
  className="team-card"
  onClick={() =>
    navigate(`/teams/${team._id}`)
  }
>

      <div className="team-avatar">
        {team.name?.charAt(0)}
      </div>

      <h3>
        {team.name}
      </h3>

      <p>
        {team.description}
      </p>

      <div className="team-info">

        <span>
          {team.members?.length} members
        </span>

        <span>
          {team.visibility}
        </span>

      </div>

    </div>

  ))}

</div>

{showModal && (

  <div className="modal-overlay">

    <div className="modal">

      <h2>Create Team</h2>

      <input
        type="text"
        placeholder="Team Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <select
        value={visibility}
        onChange={(e) =>
          setVisibility(
            e.target.value
          )
        }
      >
        <option value="public">
          Public
        </option>

        <option value="private">
          Private
        </option>
      </select>

      <div className="modal-buttons">

        <button
          className="secondary-btn"
          onClick={() =>
            setShowModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={createTeam}
        >
          Create
        </button>

      </div>

    </div>

  </div>

)}


{showJoinModal && (

  <div className="modal-overlay">

    <div className="modal">

      <h2>Join Private Team</h2>

      <input
        type="text"
        placeholder="Enter Invite Code"
        value={inviteCode}
        onChange={(e) =>
          setInviteCode(
            e.target.value
          )
        }
      />

      <div className="modal-buttons">

        <button
          className="secondary-btn"
          onClick={() =>
            setShowJoinModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={joinPrivateTeam}
        >
          Join Team
        </button>

      </div>

    </div>

  </div>

)}

{createdInviteCode && (

  <div className="modal-overlay">

    <div className="modal">

      <h2>
        Team Created 🎉
      </h2>

      <p>
        Share this invite code
        with your teammates.
      </p>

      <input
        value={createdInviteCode}
        readOnly
      />

      <button
        className="primary-btn"
        onClick={() => {
          navigator.clipboard.writeText(
            createdInviteCode
          );

          alert(
            "Invite Code Copied"
          );
        }}
      >
        Copy Code
      </button>

      <button
        className="secondary-btn"
        onClick={() =>
          setCreatedInviteCode("")
        }
      >
        Close
      </button>

    </div>

  </div>

)}

    </Layout>
  );
}

export default Teams;