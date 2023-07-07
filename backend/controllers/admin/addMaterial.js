// controllers/admin/addMaterial.js

const Course = require("../../models/Course");
const Material = require("../../models/Material");

const addMaterial = async (req, res) => {
  const { courseId } = req.params;
  const { name, description,url,filePath } = req.body;

  try {
    // Find the course
    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create a new material
    const material = new Material({ name, description,url,filePath });
    await material.save();

    // Add the material to the course's materials array
    course.materials.push(material);
    await course.save();

    res.json({ message: "Material added to course successfully", course });
  } catch (error) {
    console.error("Error adding material to course:", error);
    res.status(500).json({ message: "Error adding material to course" });
  }
};

module.exports = addMaterial;
