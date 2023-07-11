const Course = require("../../models/Course");

/**
 * Get all the enrolled students with their course names.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the enrolled students are retrieved successfully.
 */
const getAllEnrolledStudents = async (req, res) => {
  try {
    // Find all courses
    const courses = await Course.find();

    const enrolledStudents = [];

    // Iterate over each course and extract the enrolled students' email addresses along with the course name
    courses.forEach((course) => {
      const courseName = course.name;
      const courseId = course.courseId;

      const students = course.enrolledStudents.map((email) => email);

      enrolledStudents.push({ courseId,courseName, students });
    });

    res.json({ enrolledStudents });
  } catch (error) {
    console.error("Error retrieving enrolled students:", error);
    res.status(500).json({ message: "Error retrieving enrolled students" });
  }
};

module.exports = getAllEnrolledStudents;
