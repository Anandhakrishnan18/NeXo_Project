import "../styles/login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    alert("Login Successful");

    navigate("/dashboard");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Login Failed"
    );
  }
};

  return (
    <div className="login-container">

      <div className="login-left">
        <div className="logo">
          <h2>NeXo</h2>
        </div>

        <div className="hero">
          <h1>
            Where teams meet,
            build, and ship
            together.
          </h1>

          <p>
            Video meetings, real-time chat,
            shared whiteboards, and files —
            one professional workspace for your team.
          </p>
        </div>

        <div className="footer">
          © 2026 NeXo
        </div>
      </div>

      <div className="login-right">

        <div className="login-card">

          <h2>Sign in to your account</h2>

          <p>
            Welcome back. Please enter your details.
          </p>

          <form onSubmit={handleLogin}>

            <label>Email</label>
            <input
  type="email"
  placeholder="you@company.com"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
/>

            <label>Password</label>
            <input
  type="password"
  placeholder="********"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
/>

            <button type="submit">
              Sign In
            </button>

          </form>

          <p className="register-link">
            Don't have an account?
            <Link to="/register">
              Create one
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;