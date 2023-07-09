const Course = require("../../models/Course");

const getEnrolledCourses = async (req, res) => {
  try {
    // Extract the student email from the request body
    const { email } = req.body;
    console.log(req.body)
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
