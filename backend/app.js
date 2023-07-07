const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
// Import the authenticateUser middleware
const authenticateUser = require('./middlewares/authenticateUser');

const app = express()

// Middleware to parse JSON data
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error)
  })

// Controllers
const registerUser = require("./controllers/registeruser")
const verifyUser = require("./controllers/verifyuser")
const loginUser = require("./controllers/login")
const forgotPassword = require("./controllers/forgotpassword")
const resetPassword = require("./controllers/resetpassword")



// Register a new user
app.post("/register", registerUser)

// Verify the user with OTP
app.post("/verify", verifyUser)

// Forgot Password - Generate OTP and send email
app.post("/forgotpassword", forgotPassword)

// Reset Password
app.put("/resetpassword", resetPassword)

// Authenticate a user and generate JWT token
app.post("/login", loginUser)



/**
 * ADMIN PART STARTED
 */
// Controllers
const createCourse = require("./controllers/admin/createCourse")
const loginAdmin = require("./controllers/admin/loginadmin")
const getCourse = require("./controllers/admin/getCourse")
const updateCourse = require("./controllers/admin/updateCourse")
const deleteCourse = require("./controllers/admin/deleteCourse")
const addMaterial = require("./controllers/admin/addMaterial")
const updateMaterial = require("./controllers/admin/updateMaterial");
const deleteMaterial = require("./controllers/admin/deleteMaterial");

//
app.delete("/admin/courses/:courseId/materials/:materialId", authenticateUser,deleteMaterial)

// Add a Material to the course
app.post("/admin/courses/:courseId/materials",authenticateUser, addMaterial);

// Update a material in the course
app.put("/admin/courses/:courseId/materials/:materialId", authenticateUser,updateMaterial);

// Delete a course
app.delete('/admin/courses/:courseId', authenticateUser, deleteCourse);

// Update a course
app.put('/admin/courses/:courseId', authenticateUser,updateCourse);

// Login Admin 
app.post('/login/admin', loginAdmin)

// Create a new course
app.post('/admin/courses', authenticateUser, createCourse);

// Get detail of specific course
app.get('/admin/courses/:courseId', authenticateUser, getCourse);


// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
