import {
  LayoutDashboard,
  Video,
  Users,
  Folder,
  Bell,
  Settings,
  LogOut,
  Hexagon,
  User 
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="sidebar">

      <div>

        <div className="logo-box">
          <div className="logo-icon">
            <Hexagon size={18} />
          </div>

          <h2 className="logo">
            NeXo
          </h2>
        </div>

        <ul className="sidebar-menu">

          <li
            className={
              location.pathname === "/dashboard"
                ? "active"
                : ""
            }
          >
            <Link to="/dashboard">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>

          <li
            className={
              location.pathname === "/meetings"
                ? "active"
                : ""
            }
          >
            <Link to="/meetings">
              <Video size={18} />
              Meetings
            </Link>
          </li>

          <li
            className={
              location.pathname === "/teams"
                ? "active"
                : ""
            }
          >
            <Link to="/teams">
              <Users size={18} />
              Teams
            </Link>
          </li>

          <li
            className={
              location.pathname === "/files"
                ? "active"
                : ""
            }
          >
            <Link to="/files">
              <Folder size={18} />
              Files
            </Link>
          </li>

          <li
            className={
              location.pathname === "/notifications"
                ? "active"
                : ""
            }
          >
            <Link to="/notifications">
              <Bell size={18} />
              Notifications
            </Link>
          </li>

          <li
  className={
    location.pathname === "/settings"
      ? "active"
      : ""
  }
>
  <Link to="/settings">
    <User size={18} />
    Profile
  </Link>
</li>

        </ul>
      </div>

      <button
        className="logout-btn"
        onClick={logout}
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;