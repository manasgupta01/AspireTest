const Course =require('../../models/Course');

// Get details of a specific course
const getCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error('Error retrieving course:', error);
    return res.status(500).json({ message: 'Failed to retrieve course' });
  }
};

module.exports = getCourse;
