import Layout from "../components/Layout";
import "../styles/settings.css";
import { useState, useRef } from "react";
import API from "../services/api";
import { User, Settings as SettingsIcon, Camera, Save } from "lucide-react";
import ThemeCard from "../components/Settings/ThemeCard";
import AudioCard from "../components/Settings/AudioCard";
import VideoCard from "../components/Settings/VideoCard";
import NotificationCard from "../components/Settings/NotificationCard";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form states
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");



  const fileInputRef = useRef(null);

  const handleProfileSave = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty");
      return;
    }
    try {
      const res = await API.put("/auth/profile", { username });
      // Update local storage user profile
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Profile updated successfully!");
      window.location.reload(); // Refresh the header/sidebar layout
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const res = await API.post("/auth/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAvatar(res.data.avatar);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Profile picture updated!");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to upload avatar");
      }
    }
  };



  const initials = user?.username?.substring(0, 2).toUpperCase() || "UN";

  return (
    <Layout>
      <h1 className="settings-title">Settings</h1>
      <p className="settings-subtitle">
        Manage your profile, upload an avatar, and secure your account.
      </p>

      <div className="settings-tabs">
        <button
          className={activeTab === "profile" ? "active-tab" : ""}
          onClick={() => setActiveTab("profile")}
        >
          <User size={18} /> Profile Details
        </button>
        <button
          className={activeTab === "settings" ? "active-tab" : ""}
          onClick={() => setActiveTab("settings")}
        >
          <SettingsIcon size={18} /> Settings
        </button>
      </div>

      <div className="settings-card">
        {activeTab === "profile" ? (
          <div>
            <div className="profile-section">
              <div
                className="avatar-large"
                onClick={handleAvatarClick}
                style={{
                  cursor: "pointer",
                  overflow: "hidden",
                  position: "relative",
                  border: "2px solid var(--border)",
                }}
                title="Click to change avatar"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  initials
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(15, 23, 42, 0.7)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "4px 0",
                  }}
                >
                  <Camera size={14} />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
                accept="image/*"
              />
              <div>
                <h3>Profile photo</h3>
                <p>Click on the circle to upload a custom avatar.<br />PNG or JPG, up to 2 MB.</p>
              </div>
            </div>

            <div className="settings-form">
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div style={{ overflow: "hidden" }}>
              <button className="save-btn" onClick={handleProfileSave}>
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        ) : activeTab === "settings" ? (
          <div className="settings-module">
            <ThemeCard />
            <AudioCard />
            <VideoCard />
            <NotificationCard />
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

export default Settings;