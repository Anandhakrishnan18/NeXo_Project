import Layout from "../components/Layout";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";


function VideoCall() {

  const { id } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
const peerConnection = useRef(null);
const localStreamRef = useRef(null);

const startCamera = async () => {
  try {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

    localStreamRef.current =
      stream;

    if (localVideoRef.current) {

      localVideoRef.current.srcObject =
        stream;

    }

  } catch (error) {

    console.log(error);

  }
};


const createPeerConnection = () => {

  const pc =
    new RTCPeerConnection({
      iceServers: [
        {
          urls:
            "stun:stun.l.google.com:19302",
        },
      ],
    });

  peerConnection.current = pc;

  localStreamRef.current
    ?.getTracks()
    .forEach((track) => {

      pc.addTrack(
        track,
        localStreamRef.current
      );

    });

  pc.ontrack = (event) => {

    if (
      remoteVideoRef.current
    ) {

      remoteVideoRef.current.srcObject =
        event.streams[0];

    }

  };

  pc.onicecandidate =
    (event) => {

      if (event.candidate) {

        socket.emit(
          "ice-candidate",
          {
            roomId: id,
            candidate:
              event.candidate,
          }
        );

      }

    };

  return pc;
};


useEffect(() => {

  startCamera();

  socket.emit(
    "join-video-room",
    id
  );

  socket.on(
    "user-joined",
    (userId) => {

      console.log(
        "User Joined:",
        userId
      );

    }
  );

  socket.on(
    "user-left",      
    (userId) => {

      console.log(
        "User Left:",
        userId
      );

    }
  );

  return () => {

    socket.emit(
      "leave-video-room",
      id
    );

    socket.off(
      "user-joined"
    );

    socket.off(
      "user-left"
    );

  };

}, []);



  return (
    <Layout>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
        }}
      >

        <h1>
          Video Meeting
        </h1>

        <p>
          Room ID: {id}
        </p>

        <div
          style={{
            marginTop: "20px",
          }}
        >

         <video
  ref={localVideoRef}
  autoPlay
  playsInline
  muted
  style={{
    width: "500px",
    height: "350px",
    background: "#000",
    borderRadius: "12px",
    objectFit: "cover",
  }}
/>

<video
  ref={remoteVideoRef}
  autoPlay
  playsInline
  style={{
    width: "500px",
    height: "350px",
    background: "#000",
    borderRadius: "12px",
    objectFit: "cover",
    marginLeft: "20px",
  }}
/>

        </div>

      </div>

    </Layout>
  );
}

export default VideoCall;