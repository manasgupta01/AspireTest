const Course = require('../../models/Course');

// Update a course
const updateCourse = async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const { name, description, courseCode, materials } = req.body;
  
      const updatedCourse = await Course.findOneAndUpdate(
        { courseId: courseId }, // Update the query to use "courseId" field
        { name, description, courseCode, materials },
        { new: true }
      );
  
      if (updatedCourse) {
        return res.status(200).json(updatedCourse);
      } else {
        return res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      console.error("Error updating course:", error);
      return res.status(500).json({ message: "Error updating course" });
    }
  };
  

module.exports = updateCourse;
