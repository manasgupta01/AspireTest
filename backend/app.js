var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// async function sendEmail() {
//   const clientId = '9f2f5e0b-0b8d-4cb2-ac38-bcc965ccc80d';
//   const clientSecret = 'ezQ8Q~vq.UcdZ-EiUiXBvhmX5VTDCE4Q1Oqw4dvm';
//   const tenantId = '2ba3ab00-1ab1-48b7-9a5b-988f70b5b7de';
//   const redirectUri = 'https://www.postman.com/oauth2/callback';
//   const userEmailAddress = 'EN20CS306029@medicapsinstituteac.onmicrosoft.com';
// user: 'manasgupta7624@gmail.com',
// pass: 'wmurxvmxaonrnwll'


// const express = require('express');
// const fs = require('fs');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');

// const app = express();

// // Middleware to parse JSON data
// app.use(express.json());

// // In-memory store for registered users
// let users = [];

// // JSON file path
// const dbFilePath = 'users.json';

// // Read data from the JSON file and initialize the users array
// function readDataFromJsonFile() {
//   try {
//     const jsonData = fs.readFileSync(dbFilePath, 'utf8');
//     users = JSON.parse(jsonData);
//   } catch (error) {
//     console.log('Error reading JSON file:', error);
//     users = [];
//   }
// }

// // Write data to the JSON file
// function writeDataToJsonFile() {
//   const jsonData = JSON.stringify(users, null, 2);
//   fs.writeFileSync(dbFilePath, jsonData, 'utf8');
// }

// // Helper function to generate OTP
// function generateOTP() {
//   // Implement your logic to generate a 25-digit alphanumeric OTP here
//   // For simplicity, we'll generate a random 25-character string
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let otp = '';
//   for (let i = 0; i < 25; i++) {
//     otp += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return otp;
// }

// // Email configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'manasgupta7624@gmail.com',
//     pass: 'wmurxvmxaonrnwll'
//   }
// });

// // Register endpoint
// app.post('/register', (req, res) => {
//   const {
//     username,
//     password,
//     confirmPassword,
//     email,
//     collegeName,
//     firstName,
//     lastName
//   } = req.body;

//   // Check if password and confirmPassword match
//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: "Password and confirm password do not match" });
//   }

//   // Check if username or email already exists
//   const existingUser = users.find(user => user.username === username || user.email === email);
//   if (existingUser) {
//     return res.status(409).json({ message: "Username or email already exists" });
//   }

//   // Generate OTP
//   const otp = generateOTP();

//   // Create user with the provided details
//   const user = {
//     username,
//     password, // For demo purposes, do not store passwords in plain text in production
//     email,
//     collegeName,
//     firstName,
//     lastName,
//     otp,
//     verified: false
//   };

//   // Save the user to the in-memory store
//   users.push(user);

//   // Write data to the JSON file
//   writeDataToJsonFile();

//   // Send email with OTP to the provided email address
//   const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: email,
//     subject: 'Registration OTP',
//     text: `Your OTP for registration is: ${otp}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });

//   console.log("User registered successfully:");
//   console.log(user);
//   return res.status(201).json({ message: "User registered successfully" });
// });

// // Verify endpoint
// app.post('/verify', (req, res) => {
//   const { email, otp } = req.body;

//   // Find the user with the provided email address
//   const user = users.find(user => user.email === email);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Check if the provided OTP matches the user's OTP
//   if (otp !== user.otp) {
//     return res.status(401).json({ message: "Invalid OTP" });
//   }

//   // Set the user as verified
//   user.verified = true;

//   // Write data to the JSON file
//   writeDataToJsonFile();

//   console.log("User verified successfully:");
//   console.log(user);
//   return res.status(200).json({ message: "User verified successfully" });
// });

// // Login endpoint
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Find the user with the provided username
//   const user = users.find(user => user.username === username);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Check if the password matches
//   if (password !== user.password) {
//     return res.status(401).json({ message: "Invalid password" });
//   }

//   // Check if the user is verified
//   if (!user.verified) {
//     return res.status(401).json({ message: "User not verified" });
//   }

//   // Create a payload for the JWT token
//   const payload = {
//     username: user.username,
//     email: user.email,
//     collegeName: user.collegeName
//   };

//   // Generate JWT token
//   const token = jwt.sign(payload, 'your-secret-key');

//   console.log("User logged in successfully:");
//   console.log(user);
//   return res.status(200).json({ token });
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

// // Read data from the JSON file on server startup
// readDataFromJsonFile();
