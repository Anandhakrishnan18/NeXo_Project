import Layout from "../components/Layout";
import "../styles/notifications.css";

function Notifications() {
  return (
    <Layout>

      <div className="notifications-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Stay on top of mentions, invites, and updates.
          </p>
        </div>

        <button className="mark-read-btn">
          Mark all read
        </button>

      </div>

      <div className="notifications-card">

        <div className="notification-empty">

          <div className="bell-icon">
            🔔
          </div>

          <p>
            You're all caught up.
          </p>

        </div>

      </div>

    </Layout>
  );
}

export default Notifications;