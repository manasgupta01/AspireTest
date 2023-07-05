const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  collegeName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otp: { type: String, required: false },
  verified: { type: Boolean, default: false },
});

let User;
if (!mongoose.models.User) {
  User = mongoose.model("User", userSchema);
} else {
  User = mongoose.model("User");
}

module.exports = User;
