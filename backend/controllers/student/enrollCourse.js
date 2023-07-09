// controllers/student/enrollStudent.js

const Course = require("../../models/Course");

const enrollStudent = async (req, res) => {
  try {
    // Extract the necessary information from the request URL
    const { courseId } = req.params;

    // Extract the student email from the request body
    const { email } = req.body;

    // Find the course by its courseId
    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the student is already enrolled in the course
    if (course.enrolledStudents.includes(email)) {
      return res.status(400).json({ message: "Student already enrolled in the course" });
    }

    // Enroll the student in the course
    course.enrolledStudents.push(email);
    await course.save();

    // Return a response indicating success
    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Failed to enroll student" });
  }
};

module.exports = enrollStudent;
