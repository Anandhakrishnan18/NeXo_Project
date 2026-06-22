import "../styles/meetings.css";
import Layout from "../components/Layout";
import { Video } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Meetings() {

    const navigate = useNavigate();

  const [meetings, setMeetings] =
    useState([]);

const [showModal, setShowModal] =
  useState(false);

const [title, setTitle] =
  useState("");

const [description, setDescription] =
  useState("");

const [type, setType] =
  useState("instant");

const [scheduledTime, setScheduledTime] =
  useState("");


  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {

      const res =
        await API.get("/meetings");

      setMeetings(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const createMeeting = async () => {
  try {

    await API.post(
      "/meetings",
      {
        title,
        description,
        type,
        scheduledTime,
      }
    );

    fetchMeetings();

    setShowModal(false);

    setTitle("");
    setDescription("");
    setType("instant");
    setScheduledTime("");

  } catch (error) {
    console.log(error);
  }
};
  return (
    <Layout>

      <div className="meetings-header">

        <div>
          <h1>Meetings</h1>
          <p>
            Start instant meetings or schedule one
            with your team.
          </p>
        </div>

        <div className="meetings-actions">
          <button className="secondary-btn">
            Join Meeting
          </button>

          <button
  className="primary-btn"
  onClick={() =>
    setShowModal(true)
  }
>
  + Create Meeting
</button>
        </div>

      </div>

      <div className="meeting-tabs">

        <button className="active-tab">
          All
        </button>

        <button>
          Instant
        </button>

        <button>
          Scheduled
        </button>

      </div>

      <div className="meeting-grid">

{meetings.map((meeting) => (

  <div
    key={meeting._id}
    className="meeting-card"
  >

    <div className="meeting-icon">
      <Video size={18} />
    </div>

    <h3>
      {meeting.title}
    </h3>

    <p>
      {meeting.description}
    </p>

    <div className="meeting-status">
      {meeting.status}
    </div>

<button
  onClick={() =>
    navigate(
      `/meetings/${meeting._id}`
    )
  }
>
  Join Meeting
</button>

  </div>

))}

      </div>

      {showModal && (

  <div className="modal-overlay">

    <div className="modal">

      <h2>
        Create Meeting
      </h2>

      <input
        type="text"
        placeholder="Meeting Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value)
        }
      >
        <option value="instant">
          Instant
        </option>

        <option value="scheduled">
          Scheduled
        </option>
      </select>

      {type === "scheduled" && (

        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) =>
            setScheduledTime(
              e.target.value
            )
          }
        />

      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >

        <button
          className="primary-btn"
          onClick={createMeeting}
        >
          Create
        </button>

        <button
          className="secondary-btn"
          onClick={() =>
            setShowModal(false)
          }
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}

    </Layout>
  );
}

export default Meetings;