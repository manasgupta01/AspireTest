const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Create the User model
const User = mongoose.model("User", userSchema);

class Database {
  constructor() {
    this.connectToDatabase();
  }

  connectToDatabase() {
    mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
      });
  }

  getUserByUsername(username) {
    return User.findOne({ username: username });
  }

  getUserByEmail(email) {
    return User.findOne({ email: email });
  }

  addUser(user) {
    const newUser = new User(user);
    return newUser.save();
  }

  updateUser(user) {
    return User.findOneAndUpdate({ email: user.email }, user, { new: true });
  }
}

module.exports = new Database();
