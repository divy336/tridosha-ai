import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./design/passreset.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/reset-password", {
        email,
        token,
        password,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="passreset-page">
      <div className="passreset-card">
        <div className="passreset-brand">
          <div className="passreset-logo">
            <span>🌿</span>
          </div>
          <div>
            <h2 className="passreset-title">Ayurveda</h2>
            <div className="passreset-subtitle"></div>
          </div>
        </div>

        <h1>Reset Password</h1>

        <form onSubmit={handleSubmit} className="passreset-form">
          <div className="field">
            <div className="label">New Password</div>
            <input
              className="input"
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <div className="label">Confirm Password</div>
            <input
              className="input"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
