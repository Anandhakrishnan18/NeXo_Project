import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";
import { useNavigate }
from "react-router-dom";

function MeetingDetails() {

  const { id } = useParams();

  const [meeting, setMeeting] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [newMessage, setNewMessage] =
    useState("");
  
  const navigate =useNavigate();


useEffect(() => {

  fetchMeeting();

  fetchMessages();

  socket.emit(
    "join-meeting",
    id
  );

  socket.on(
    "receive-meeting-message",
    (message) => {

      setMessages((prev) => [
        ...prev,
        message,
      ]);

    }
  );

  return () => {

    socket.emit(
      "leave-meeting",
      id
    );

    socket.off(
      "receive-meeting-message"
    );

  };

}, []);

  const fetchMeeting = async () => {
    try {

      const res =
        await API.get(
          `/meetings/${id}`
        );

      setMeeting(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
  try {

    const res =
      await API.get(
        `/meeting-messages/${id}`
      );

    setMessages(res.data);

  } catch (error) {
    console.log(error);
  }
};

const sendMessage = () => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (!newMessage.trim())
    return;

  socket.emit(
    "send-meeting-message",
    {
      meetingId: id,
      senderId: user._id,
      content: newMessage,
    }
  );

  setNewMessage("");
};

  if (!meeting) {
    return (
      <Layout>
        <h2>Loading...</h2>
      </Layout>
    );
  }

  return (
    <Layout>

      
<button
  className="primary-btn"
  onClick={() =>
    navigate(
      `/video-call/${id}`
    )
  }
>
  Join Video Call
</button>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
        }}
      >

        <h1>
          {meeting.title}
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#64748b",
          }}
        >
          {meeting.description}
        </p>

        <br />

        <h3>
          Type :
          {" "}
          {meeting.type}
        </h3>

        <h3>
          Status :
          {" "}
          {meeting.status}
        </h3>

        <h3>
          Participants :
          {" "}
          {meeting.participants?.length}
        </h3>

        <h3>
          Meeting Code :
          {" "}
          {meeting.meetingCode}
        </h3>

        <h3>
          Created By :
          {" "}
          {meeting.createdBy?.username}
        </h3>

        <hr
  style={{
    margin: "25px 0"
  }}
/>

<h2>Participants</h2>

<div
  style={{
    marginTop: "15px"
  }}
>

  {meeting.participants?.map(
    (participant) => (

      <div
        key={participant._id}
        style={{
          padding: "10px 0",
          borderBottom:
            "1px solid #e5e7eb"
        }}
      >

        <strong>
          {participant.username}
        </strong>

        <br />

        <small>
          {participant.email}
        </small>

      </div>

    )
  )}

</div>

<hr
  style={{
    margin: "25px 0"
  }}
/>

<h2>Meeting Chat</h2>

<div
  className="messages-list"
  style={{
    marginTop: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    minHeight: "300px",
    background: "#ffffff",
  }}
>

  {messages.length === 0 ? (

    <p>No messages yet</p>

  ) : (

    messages.map((msg) => (

      <div
        key={msg._id}
        style={{
          marginBottom: "15px",
          padding: "12px",
          background: "#f8fafc",
          borderRadius: "10px",
        }}
      >

        <strong>
          {msg.sender?.username}
        </strong>

        <p
          style={{
            marginTop: "5px",
          }}
        >
          {msg.content}
        </p>

      </div>

    ))

  )}

</div>

<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  }}
>

  <input
    type="text"
    value={newMessage}
    onChange={(e) =>
      setNewMessage(
        e.target.value
      )
    }
    placeholder="Type a message..."
    style={{
      flex: 1,
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "10px",
    }}
  />

  <button
    className="primary-btn"
    onClick={sendMessage}
  >
    Send
  </button>

</div>

      </div>

    </Layout>
  );
}

export default MeetingDetails;