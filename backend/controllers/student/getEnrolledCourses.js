const Course = require("../../models/Course");

/**
 * Retrieve the courses in which a student is enrolled using their email.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the enrolled courses are retrieved.
 */
const getEnrolledCourses = async (req, res) => {
  try {
    // Extract the student email from the request body
    const { email } = req.body;

    // Find the courses where the student is enrolled
    const enrolledCourses = await Course.find({ enrolledStudents: email });

    // Return the enrolled courses
    res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error("Error retrieving enrolled courses:", error);
    res.status(500).json({ message: "Failed to retrieve enrolled courses" });
  }
};

module.exports = getEnrolledCourses;
