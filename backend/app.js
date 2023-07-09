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
const getEnrolledStudents = require("./controllers/admin/getEnrolledStudents");

// Get enrolled students for a course
app.get("/admin/courses/:courseId/enrolledStudents",authenticateUser,getEnrolledStudents);

// Delete a material
app.delete("/admin/courses/:courseId/materials/:materialId", authenticateUser,deleteMaterial)

// Add a Material to the course
app.post("/admin/courses/:courseId/materials",authenticateUser, addMaterial);

// Update a material in the course
app.put("/admin/courses/:courseId/materials/:materialId", authenticateUser,updateMaterial);

// Delete a course
app.delete('/admin/courses/:courseId', authenticateUser, deleteCourse);

// Update a course
app.put('/admin/courses/:courseId', authenticateUser,updateCourse);

// Create a new course
app.post('/admin/courses', authenticateUser, createCourse);

// Get detail of specific course
app.get('/admin/courses/:courseId', authenticateUser, getCourse);

// Login Admin 
app.post('/login/admin', loginAdmin)


/**
 * Student part
 */
const enrollStudent = require("./controllers/student/enrollCourse");
const getEnrolledCourses = require("./controllers/student/getEnrolledCourses");
const getCourseDetails = require("./controllers/student/getCourseDetails");
const getMaterials = require("./controllers/student/getMaterials");
  // Import the getMaterialDetails controller
const getMaterialDetails = require("./controllers/student/getMaterialDetails");
// Import the getStudentDetails controller
const getStudentDetails = require("./controllers/student/getStudentDetails");

// Route to retrieve student details 
app.get("/student/students/:email", getStudentDetails);

// Get material details
app.get("/student/materials/:materialId",authenticateUser, getMaterialDetails);

// Get course details for a student
app.get("/student/courses/:courseId", getCourseDetails);

//get materail for a course
app.get("/student/courses/:courseId/materials", getMaterials);

// Enroll a student in a course
app.post("/student/courses/:courseId/enroll",authenticateUser, enrollStudent);

app.get("/student/courses", authenticateUser, getEnrolledCourses);



// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
  