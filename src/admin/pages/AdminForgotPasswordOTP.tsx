import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../pages/design/admin.css";

function AdminForgotPasswordOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://tridosha-ai.onrender.com/api/admin/forgot-password/verify-otp",
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