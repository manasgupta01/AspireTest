const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Import the authenticateUser middleware
const authenticateStudent = require("./middlewares/authenticateStudent");
const authenticateAdmin = require("./middlewares/authenticateAdmin");

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
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

// Controllers
const registerUser = require("./controllers/registeruser");
const verifyUser = require("./controllers/verifyuser");
const loginUser = require("./controllers/login");
const forgotPassword = require("./controllers/forgotpassword");
const resetPassword = require("./controllers/resetpassword");

// Register a new user
app.post("/register", registerUser);

// Verify the user with OTP
app.post("/verify", verifyUser);

// Forgot Password - Generate OTP and send email
app.post("/forgotpassword", forgotPassword);

// Reset Password
app.put("/resetpassword", resetPassword);

// Authenticate a user and generate JWT token
app.post("/login", loginUser);

/**
 * ADMIN PART STARTED
 */

// Controllers
const createCourse = require("./controllers/admin/createCourse");
const loginAdmin = require("./controllers/admin/loginadmin");
const getCourse = require("./controllers/admin/getCourse");
const updateCourse = require("./controllers/admin/updateCourse");
const deleteCourse = require("./controllers/admin/deleteCourse");
const addMaterial = require("./controllers/admin/addMaterial");
const updateMaterial = require("./controllers/admin/updateMaterial");
const deleteMaterial = require("./controllers/admin/deleteMaterial");
const getEnrolledStudents = require("./controllers/admin/getEnrolledStudents");
const getAllEnrolledStudents = require("./controllers/admin/getAllEnrolledStudents");
const banStudent = require("./controllers/admin/banStudent");

// Ban a student
app.post("/admin/students/ban", authenticateAdmin, banStudent);
// Get All enrolled students for all courses

app.get(
  "/admin/allEnrolledStudents", // Endpoint to get all enrolled students
  authenticateAdmin, // Middleware to authenticate the user
  getAllEnrolledStudents // Controller function to get all enrolled students
);

// Get enrolled students for a course
app.get(
  "/admin/courses/:courseId/enrolledStudents", // Endpoint to get enrolled students
  authenticateAdmin, // Middleware to authenticate the user
  getEnrolledStudents // Controller function to get enrolled students
);

// Delete a material
app.delete(
  "/admin/courses/:courseId/materials/:materialId", // Endpoint to delete a material
  authenticateAdmin, // Middleware to authenticate the user
  deleteMaterial // Controller function to delete a material
);

// Add a Material to the course
app.post(
  "/admin/courses/:courseId/materials", // Endpoint to add a material
  authenticateAdmin, // Middleware to authenticate the user
  addMaterial // Controller function to add a material
);

// Update a material in the course
app.put(
  "/admin/courses/:courseId/materials/:materialId", // Endpoint to update a material
  authenticateAdmin, // Middleware to authenticate the user
  updateMaterial // Controller function to update a material
);

// Delete a course
app.delete(
  "/admin/courses/:courseId", // Endpoint to delete a course
  authenticateAdmin, // Middleware to authenticate the user
  deleteCourse // Controller function to delete a course
);

// Update a course
app.put(
  "/admin/courses/:courseId", // Endpoint to update a course
  authenticateAdmin, // Middleware to authenticate the user
  updateCourse // Controller function to update a course
);

// Create a new course
app.post(
  "/admin/courses", // Endpoint to create a new course
  authenticateAdmin, // Middleware to authenticate the user
  createCourse // Controller function to create a new course
);

// Get detail of specific course
app.get(
  "/admin/courses/:courseId", // Endpoint to get details of a specific course
  authenticateAdmin, // Middleware to authenticate the user
  getCourse // Controller function to get details of a specific course
);

// Login Admin
app.post("/login/admin", loginAdmin);

/**
 * Student part
 */
// Controllers
const enrollStudent = require("./controllers/student/enrollCourse");
const getEnrolledCourses = require("./controllers/student/getEnrolledCourses");
const getCourseDetails = require("./controllers/student/getCourseDetails");
const getMaterials = require("./controllers/student/getMaterials");
const getMaterialDetails = require("./controllers/student/getMaterialDetails");
const getStudentDetails = require("./controllers/student/getStudentDetails");

// Route to retrieve student details
app.get(
  "/student/students/:email", // Endpoint to retrieve student details
  authenticateStudent, // Middleware to authenticate the user
  getStudentDetails // Controller function to retrieve student details
);

// Get material details
app.get(
  "/student/materials/:materialId", // Endpoint to get material details
  authenticateStudent, // Middleware to authenticate the user
  getMaterialDetails // Controller function to get material details
);

// Get course details for a student
app.get(
  "/student/courses/:courseId", // Endpoint to get course details for a student
  authenticateStudent, // Middleware to authenticate the user
  getCourseDetails // Controller function to get course details for a student
);

// Get materials for a course
app.get(
  "/student/courses/:courseId/materials", // Endpoint to get materials for a course
  authenticateStudent, // Middleware to authenticate the user
  getMaterials // Controller function to get materials for a course
);

// Enroll a student in a course
app.post(
  "/student/courses/:courseId/enroll", // Endpoint to enroll a student in a course
  authenticateStudent, // Middleware to authenticate the user
  enrollStudent // Controller function to enroll a student in a course
);

// Get enrolled courses for a student
app.get(
  "/student/courses", // Endpoint to get enrolled courses for a student
  authenticateStudent, // Middleware to authenticate the user
  getEnrolledCourses // Controller function to get enrolled courses for a student
);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
