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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meetings" element={<Meetings />} />
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