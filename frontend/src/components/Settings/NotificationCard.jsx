import { useState, useEffect } from "react";
import { Bell, Send } from "lucide-react";

export default function NotificationCard() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");

  useEffect(() => {
    try {
      if ("Notification" in window) {
        setPermissionStatus(Notification.permission);
      }
      const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
      if (savedSettings.notifications && Notification.permission === "granted") {
        setNotificationsEnabled(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveSetting = (key, value) => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
      savedSettings[key] = value;
      localStorage.setItem("settings", JSON.stringify(savedSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }

    if (!notificationsEnabled) {
      // Trying to enable
      let perm = Notification.permission;
      if (perm !== "granted") {
        perm = await Notification.requestPermission();
      }
      
      setPermissionStatus(perm);
      
      if (perm === "granted") {
        setNotificationsEnabled(true);
        saveSetting("notifications", true);
      } else {
        setNotificationsEnabled(false);
        saveSetting("notifications", false);
      }
    } else {
      // Trying to disable
      setNotificationsEnabled(false);
      saveSetting("notifications", false);
    }
  };

  const testNotification = () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted" && notificationsEnabled) {
      new Notification("NeXo", {
        body: "Desktop notifications are working correctly.",
        icon: "/favicon.ico" // Placeholder for NeXo logo
      });
    } else {
      alert("Please enable notifications first.");
    }
  };

  return (
    <div className="settings-module-card">
      <div className="settings-module-header">
        <Bell size={20} />
        Desktop Notifications
      </div>
      
      <div className="notification-toggle-row">
        <div>
          <h4 style={{ color: "var(--text-main)", marginBottom: "4px" }}>Enable Notifications</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
            {permissionStatus === "denied" 
              ? "Permission Denied. Please enable in browser settings."
              : notificationsEnabled 
                ? "Notifications Enabled" 
                : "Receive alerts for meetings and messages"}
          </p>
        </div>
        
        <label className="switch">
          <input 
            type="checkbox" 
            checked={notificationsEnabled} 
            onChange={handleToggle} 
            disabled={permissionStatus === "denied"}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button 
          className="settings-action-btn" 
          onClick={testNotification}
          disabled={!notificationsEnabled}
          style={{ opacity: notificationsEnabled ? 1 : 0.5, cursor: notificationsEnabled ? "pointer" : "not-allowed" }}
        >
          <Send size={16} /> Send Test Notification
        </button>
      </div>
    </div>
  );
}
