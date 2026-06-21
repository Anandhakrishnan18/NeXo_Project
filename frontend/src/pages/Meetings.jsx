import "../styles/meetings.css";
import Layout from "../components/Layout";
import { Video } from "lucide-react";

function Meetings() {
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

          <button className="primary-btn">
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

        <div className="meeting-card">

          <div className="meeting-icon">
  <Video size={18}/>
</div>

<h3>Daily Standup</h3>

          <p>Morning Sync</p>

          <div className="meeting-status">
  Active
</div>

          <button>
            Join meeting
          </button>

        </div>

        <div className="meeting-card">

          

          <div className="meeting-icon">
  <Video size={18}/>
</div>

<h3>Sprint Planning</h3>

          <p>Planning Meeting</p>

          <div className="meeting-status">
  Upcoming
</div>

          <button>
            Join meeting
          </button>

        </div>

      </div>

    </Layout>
  );
}

export default Meetings;