const Course = require("../../models/Course");
const Material = require("../../models/Material");

const updateMaterial = async (req, res) => {
  const { courseId, materialId } = req.params;
  const { name, description, url, filePath } = req.body;

  try {
    // Find the course
    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the material within the course
    const material = course.materials.find((material) => material._id.toString() === materialId);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Update the material details
    material.name = name || material.name;
    material.description = description || material.description;
    material.url = url || material.url;
    material.filePath = filePath || material.filePath;

    await course.save();

    res.json({ message: "Material updated successfully", course });
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ message: "Error updating material" });
  }
};

module.exports = updateMaterial;
