import React, { useState } from "react";
import axios from "axios";

const VerifyForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifySubmit = (e) => {
    e.preventDefault();

    axios
      .post("/verify", { email, otp })
      .then((response) => {
        // Handle success response
        setMessage("User verified successfully");
      })
      .catch((error) => {
        // Handle error response
        setMessage("Error verifying user");
      });
  };

  return (
    <div>
      <h2>Verify User</h2>
      <form onSubmit={handleVerifySubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyForm;
