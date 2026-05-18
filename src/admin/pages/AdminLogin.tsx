import { useState } from "react";

import axios from "axios";

import {

  useNavigate,

  Link

} from "react-router-dom";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = async (

    e: React.FormEvent<HTMLFormElement>

  ) => {

    e.preventDefault();

    try {

      const response = await axios.post(

        "http://127.0.0.1:5000/api/admin/login",

        {
          email: email,
          password: password
        }

      );

      // STORE ADMIN LOGIN
      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      localStorage.setItem(
        "adminEmail",
        email
      );

      alert(response.data.message);

      // REDIRECT DASHBOARD
      navigate("/admin/dashboard");

    } catch (error: any) {

      alert(

        error.response?.data?.message ||

        "Admin Login Failed"

      );

    }

  };

  return (

    <div>

      <h1>Admin Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">

          Login

        </button>

      </form>

      <br />

      {/* FORGOT PASSWORD */}

      <Link to="/admin/forgot-password">

        Forgot Password?

      </Link>

      <br />
      <br />

      {/* SIGNUP */}

      <Link to="/admin/signup">

        Create Admin Account

      </Link>

    </div>

  );
}

export default AdminLogin;