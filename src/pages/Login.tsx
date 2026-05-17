import { useState } from "react";

import axios from "axios";

import {
  useNavigate,
  Link
} from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    try {

      const response = await axios.post(

        "http://127.0.0.1:5000/api/login",

        {
          email: email,
          password: password
        }

      );

      console.log(response.data);

      // STORE LOGIN
      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "userEmail",
        email
      );

      alert("Login Successful");

      // REDIRECT
      navigate("/");

    } catch (error: any) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Login Failed"

      );

    }

  };

  return (

    <div>

      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        {/* LOGIN BUTTON */}

        <button type="submit">

          Login

        </button>

        <br />
        <br />

        {/* FORGOT PASSWORD */}

        <Link to="/forgot-password">

          Forgot Password?

        </Link>

      </form>

    </div>

  );
}

export default Login;