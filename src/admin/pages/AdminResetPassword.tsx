import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function AdminResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/admin/reset-password",
        {
          email,
          new_password: newPassword,
        }
      );

      alert(response.data.message);

      navigate("/admin/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div>
      <h1>Admin Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default AdminResetPassword;