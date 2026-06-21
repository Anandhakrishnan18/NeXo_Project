import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import socket from "../socket";

function TeamDetails() {
  const { id } = useParams();
  const user = JSON.parse(
  localStorage.getItem("user")
);

  const [team, setTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] =
  useState("");

useEffect(() => {

  fetchTeam();
  fetchMessages();

  socket.emit(
    "join-team",
    id
  );

  socket.on(
    "receive-message",
    (message) => {

      setMessages(
        (prev) => [
          ...prev,
          message,
        ]
      );

    }
  );

  return () => {

    socket.emit(
      "leave-team",
      id
    );

    socket.off(
      "receive-message"
    );

  };

}, []);

  const fetchTeam = async () => {
    try {
      const res = await API.get(`/teams/${id}`);

      setTeam(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        `/team-messages/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

const sendMessage = async () => {

  if (!newMessage.trim()) {
    return;
  }

  socket.emit(
    "send-message",
    {
      teamId: id,

      senderId:
        user._id,

      content:
        newMessage,
    }
  );

  setNewMessage("");
};

  if (!team) {
    return (
      <Layout>
        <h2>Loading...</h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h1>{team.name}</h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "10px",
          }}
        >
          {team.description}
        </p>

        <br />

        <h3>
          Visibility : {team.visibility}
        </h3>

        <h3>
          Members : {team.members?.length}
        </h3>

        <h3>
          Owner : {team.owner?.username}
        </h3>

        <hr
          style={{
            margin: "25px 0",
          }}
        />

        <h2>Members</h2>

        <div
          style={{
            marginTop: "15px",
          }}
        >
          {team.members?.map((member) => (
            <div
              key={member._id}
              style={{
                padding: "10px 0",
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              <strong>
                {member.username}
              </strong>

              <br />

              <small>
                {member.email}
              </small>
            </div>
          ))}
        </div>

        {team.inviteCode && (
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <h3>Invite Code</h3>

            <p>{team.inviteCode}</p>
          </div>
        )}

        <hr
          style={{
            margin: "30px 0",
          }}
        />

        <h2>Team Chat</h2>

        <div
          style={{
            marginTop: "20px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            minHeight: "300px",
            background: "#ffffff",
          }}
        >
 <div className="messages-list">

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
    marginTop: "20px",
  }}
>

  <input
    type="text"
    placeholder="Type a message..."
    value={newMessage}
    onChange={(e) =>
      setNewMessage(e.target.value)
    }
    style={{
      flex: 1,
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "10px",
    }}
  />

  <button
    onClick={sendMessage}
    style={{
      background: "#3b82f6",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "10px",
      cursor: "pointer",
    }}
  >
    Send
  </button>

</div>

        </div>
      </div>
    </Layout>
  );
}

export default TeamDetails;