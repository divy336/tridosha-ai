import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function AdminSignup() {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    try {

      const response = await axios.post(

        "http://127.0.0.1:5000/api/admin/signup",

        {
          full_name: fullName,
          email: email,
          password: password
        }

      );

      alert(response.data.message);

      navigate("/admin/otp-verify", {

        state: {
          email: email
        }

      });

    } catch (error: any) {

      alert(

        error.response?.data?.message ||

        "Signup Failed"

      );

    }

  };

  return (

    <div>

      <h1>Admin Signup</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">

          Signup

        </button>

      </form>

    </div>

  );
}

export default AdminSignup;