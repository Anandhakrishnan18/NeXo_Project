import Layout from "../components/Layout";
import "../styles/dashboard.css";
import {
  Calendar,
  Video,
  Users,
  Bell
} from "lucide-react";


function Dashboard() {
  return (
  <Layout>

    <div className="dashboard-header">

      <div>
        <h1
          style={{
            fontSize:"52px",
            marginBottom:"10px"
          }}
        >
          Welcome back !
        </h1>

        <p
          style={{
            color:"#64748b"
          }}
        >
          Here's what's happening across your workspace today.
        </p>
      </div>

      <div className="dashboard-actions">
        <button className="primary-btn">
          + Create Meeting
        </button>

        <button className="secondary-btn">
          Join Meeting
        </button>
      </div>

    </div>

    <div className="stats-grid">

  <div className="stat-card">

    <div className="stats-icon blue-bg">
      <Calendar size={20} />
    </div>

    <div className="card-line"></div>

    <h3>Upcoming Meetings</h3>

    <p>0 meetings</p>

  </div>

  <div className="stat-card">

    <div className="stats-icon green-bg">
      <Video size={20} />
    </div>

    <div className="card-line"></div>

    <h3>Recent Meetings</h3>

    <p>0 meetings</p>

  </div>

  <div className="stat-card">

    <div className="stats-icon blue-bg">
      <Users size={20} />
    </div>

    <div className="card-line"></div>

    <h3>Teams</h3>

    <p>0 teams</p>

  </div>

  <div className="stat-card">

    <div className="stats-icon yellow-bg">
      <Bell size={20} />
    </div>

    <div className="card-line"></div>

    <h3>Unread Alerts</h3>

    <p>0 alerts</p>

  </div>

</div>

<div className="bottom-grid">

  <div className="meeting-box">

    <div className="box-header">
      <h2>Upcoming meetings</h2>

      <a
        href="#"
        className="view-all"
      >
        View all
      </a>
    </div>

    <div className="empty-box">
      Your upcoming meetings will appear here once they're scheduled.
    </div>

  </div>

  <div className="quick-box">

    <div className="box-header">
      <h2>Quick actions</h2>
    </div>

    <div className="quick-actions">

      <button className="quick-btn">
        Create a team
      </button>

      <button className="quick-btn">
        Upload a file
      </button>

      <button className="quick-btn">
        Update profile
      </button>

    </div>

  </div>

</div>

  </Layout>
);
}

export default Dashboard;