const Course = require("../../models/Course");

const getMaterials = async (req, res) => {
  try {
    // Extract the courseId from the request parameters
    const { courseId } = req.params;

    // Find the course by its courseId and populate the materials field
    const course = await Course.findOne({ courseId }).populate("materials");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Retrieve the list of materials from the populated materials field
    const materials = course.materials;

    // Return the list of materials
    res.status(200).json({ materials });
  } catch (error) {
    console.error("Error retrieving materials:", error);
    res.status(500).json({ message: "Failed to retrieve materials" });
  }
};

module.exports = getMaterials;
