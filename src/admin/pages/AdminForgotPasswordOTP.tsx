import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function AdminForgotPasswordOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/admin/forgot-password/verify-otp",
        {
          email,
          otp,
        }
      );

      alert(response.data.message);

      navigate("/admin/reset-password", {
        state: { email },
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div>
      <h1>Admin OTP Verify</h1>
      <p>OTP sent to: {email}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
}

export default AdminForgotPasswordOTP;