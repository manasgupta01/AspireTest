import React, { useState } from 'react';
import axios from 'axios';
//import './RegisterForm.css'; // Import custom CSS for styling


const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side form validation
    if (!username || !password || !confirmPassword || !email || !collegeName || !firstName || !lastName) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password do not match');
      return;
    }

    try {
      // Make an HTTP POST request to the backend API
      const response = await axios.post('/register', {
        username,
        password,
        confirmPassword,
        email,
        collegeName,
        firstName,
        lastName,
      });

      setSuccessMessage(response.data.message); // User registered successfully
      setErrorMessage('');
      // Reset form fields
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setEmail('');
      setCollegeName('');
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to register user');
    }
  };

  return (
    <div className="register-form-container">
      <h2>Registration Form</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="collegeName">College Name</label>
          <input
            type="text"
            id="collegeName"
            className="form-control"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
