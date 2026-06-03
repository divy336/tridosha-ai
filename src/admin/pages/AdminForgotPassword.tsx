import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../pages/design/admin.css";

function AdminForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://tridosha-ai.onrender.com/api/admin/forgot-password",
        { email }
      );

      alert(response.data.message);

      navigate("/admin/forgot-password-otp", {
        state: { email },
      });
    } catch (error: any) {
  console.log(error);
  console.log(error.response);
  console.log(error.message);

  alert(error.message);
}
  };

  return (
    <div>
      <h1>Admin Forgot Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
}

export default AdminForgotPassword;