import Layout from "../components/Layout";
import "../styles/settings.css";

function Settings() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <Layout>

      <h1 className="settings-title">
        Settings
      </h1>

      <p className="settings-subtitle">
        Manage your profile and security preferences.
      </p>

      <div className="settings-tabs">

        <button className="active-tab">
          Profile
        </button>

        <button>
          Security
        </button>

      </div>

      <div className="settings-card">

        <div className="profile-section">

          <div className="avatar-large">
            {user?.username
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div>

            <h3>
              Profile photo
            </h3>

            <p>
              PNG or JPG, up to 2 MB.
            </p>

          </div>

        </div>

        <div className="settings-form">

          <div>

            <label>
              Full name
            </label>

            <input
              type="text"
              value={user?.username || ""}
              readOnly
            />

          </div>

          <div>

            <label>
              Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              readOnly
            />

          </div>

        </div>

        <button className="save-btn">
          Save Changes
        </button>

      </div>

    </Layout>
  );
}

export default Settings;