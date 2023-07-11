const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // User's username
  password: { type: String, required: true }, // User's password
  email: { type: String, required: true }, // User's email
  collegeName: { type: String, required: true }, // User's college name
  firstName: { type: String, required: true }, // User's first name
  lastName: { type: String, required: true }, // User's last name
  otp: { type: String, required: false }, // User's one-time password (optional)
  verified: { type: Boolean, default: false }, // User's verification status
  isBanned: { type: Boolean, default: false },
  banExpiration: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now,
  },   
  role: {
    type: String,
    default: "student",
  },
});

let User;

if (!mongoose.models.User) {
  User = mongoose.model("User", userSchema);
} else {
  User = mongoose.model("User");
}

module.exports = User;
