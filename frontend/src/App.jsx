import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Teams from "./pages/Teams";
import Files from "./pages/Files";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import "./styles/layout.css";
import TeamDetails from "./pages/TeamDetails";
import MeetingDetails from "./pages/MeetingDetails";
import VideoCall from "./pages/VideoCall";

function App() {
  useEffect(() => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
      const theme = savedSettings.theme || "dark";
      if (theme === "light" || (theme === "system" && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.body.setAttribute('data-theme', 'light');
      } else {
        document.body.removeAttribute('data-theme');
      }
    } catch (e) {
      console.error("Error loading theme", e);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route
  path="/video-call/:id"
  element={<VideoCall />}
/>
        <Route path="/teams" element={<Teams />} />
        <Route
  path="/teams/:id"
  element={<TeamDetails />}
/>
        <Route path="/files" element={<Files />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route
  path="/meetings/:id"
  element={<MeetingDetails />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;