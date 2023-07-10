const Course = require("../../models/Course");

/**
 * Delete a material from a course.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the material is deleted from the course successfully.
 */
const deleteMaterial = async (req, res) => {
  const { courseId, materialId } = req.params;

  try {
    // Find the course
    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the material within the course's materials array
    const materialIndex = course.materials.findIndex(
      (material) => material._id.toString() === materialId
    );

    if (materialIndex === -1) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Remove the material from the course's materials array
    course.materials.splice(materialIndex, 1);
    await course.save();

    res.json({ message: "Material deleted from course successfully", course });
  } catch (error) {
    console.error("Error deleting material from course:", error);
    res.status(500).json({ message: "Error deleting material from course" });
  }
};

module.exports = deleteMaterial;
