const Course = require("../../models/Course");

const getCourseDetails = async (req, res) => {
  try {
    // Extract the necessary information from the request URL
    const { courseId } = req.params;

    // Find the course by its courseId
    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Return the course details
    res.status(200).json({ course });
  } catch (error) {
    console.error("Error retrieving course details:", error);
    res.status(500).json({ message: "Failed to retrieve course details" });
  }
};

module.exports = getCourseDetails;
