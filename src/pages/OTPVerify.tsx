import { useState } from "react";

import axios from "axios";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

function OTPVerify() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    try {

      const response = await axios.post(

        "http://127.0.0.1:5000/api/verify-otp",

        {
          email: email,
          otp: otp
        }

      );

      console.log(response.data);

      alert("OTP Verified");

      // REDIRECT LOGIN
      navigate("/login");

    } catch (error) {

      console.log(error);

      alert("Invalid OTP");

    }

  };

  return (

    <div>

      <h1>OTP Verification</h1>

      <p>
        OTP sent to:
        {email}
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Verify OTP
        </button>

      </form>

    </div>

  );
}

export default OTPVerify;