import { useState } from "react";

import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

import "./design/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        email: email,
        password: password,
      });

      console.log(response.data);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);

      alert("Login Successful");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            <span>🌿</span>
          </div>
          <div>
            <h2 className="login-title">Ayurveda</h2>
            <div className="login-subtitle"></div>
          </div>
        </div>

        <h1>Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <div className="label">Email</div>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn">
            Login
          </button>

          <div className="login-links">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
