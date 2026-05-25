import { useState } from "react";
import axios from "axios";

import "./design/forgot.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/forgot-password",
        {
          email,
        },
      );

      alert(res.data.message);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-brand"></div>

        <h1>Forgot Password</h1>

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="field">
            <div className="label">Email</div>
            <input
              className="input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
