import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      alert("Registration Successful");
      navigate("/login");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>NeXo</h2>

        <div className="hero">
          <h1>
            Start collaborating
            <br />
            with your team
          </h1>

          <p>
            Create your NeXo account and start
            managing meetings, teams, files,
            and collaboration.
          </p>
        </div>

        <p className="copyright">
          © 2026 NeXo
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
  <form onSubmit={handleRegister}>
          <h1>Create Account</h1>

          <p>
            Enter your details below.
          </p>

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Create Account
          </button>

          <p className="register-link">
            Already have an account?{" "}
            <Link to="/login">
              Sign In
            </Link>
          </p>
        </form>
</div>
      </div>
    </div>
  );
}

export default Register;