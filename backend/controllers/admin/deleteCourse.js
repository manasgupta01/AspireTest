const Course = require('../../models/Course');

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const deletedCourse = await Course.findOneAndDelete({ courseId: courseId });

    if (deletedCourse) {
      return res.status(200).json({ message: "Course deleted successfully" });
    } else {
      return res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ message: "Error deleting course" });
  }
};

module.exports = deleteCourse;
