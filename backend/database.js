const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // User's username
  email: { type: String, required: true }, // User's email
  password: { type: String, required: true }, // User's password
});

// Create the User model
const User = mongoose.model("User", userSchema);

class Database {
  constructor() {
    this.connectToDatabase();
  }

  /**
   * Connects to the MongoDB database.
   */
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

  /**
   * Retrieves a user by their username.
   * @param {string} username - The username of the user.
   * @returns {Promise} A promise that resolves to the user object.
   */
  getUserByUsername(username) {
    return User.findOne({ username: username });
  }

  /**
   * Retrieves a user by their email.
   * @param {string} email - The email of the user.
   * @returns {Promise} A promise that resolves to the user object.
   */
  getUserByEmail(email) {
    return User.findOne({ email: email });
  }

  /**
   * Adds a new user to the database.
   * @param {object} user - The user object to be added.
   * @returns {Promise} A promise that resolves to the saved user object.
   */
  addUser(user) {
    const newUser = new User(user);
    return newUser.save();
  }

  /**
   * Updates a user in the database.
   * @param {object} user - The user object to be updated.
   * @returns {Promise} A promise that resolves to the updated user object.
   */
  updateUser(user) {
    return User.findOneAndUpdate({ email: user.email }, user, { new: true });
  }
}

module.exports = new Database();
