// controllers/admin/getEnrolledStudents.js

const Course = require("../../models/Course");
const User = require("../../models/User");

const getEnrolledStudents = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Find the course and populate the enrolledStudents field with user details
    const course = await Course.findById(courseId).populate("enrolledStudents", "email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Extract the enrolled students' details
    const enrolledStudents = course.enrolledStudents.map((student) => ({
      email: student.email,
    }));

    res.json({ enrolledStudents });
  } catch (error) {
    console.error("Error retrieving enrolled students:", error);
    res.status(500).json({ message: "Error retrieving enrolled students" });
  }
};

module.exports = getEnrolledStudents;
