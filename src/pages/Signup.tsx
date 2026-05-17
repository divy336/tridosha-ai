import { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

function Signup() {

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

        "http://127.0.0.1:5000/api/signup",

        {
          full_name: fullName,
          email: email,
          password: password
        }

      );

      console.log(response.data);

      alert("OTP Sent Successfully");

      // GO OTP PAGE
      navigate("/otp-verify", {

        state: {
          email: email
        }

      });

    } catch (error) {

      console.log(error);

      alert("Signup Failed");

    }

  };

  return (

    <div>

      <h1>Signup Page</h1>

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

export default Signup;