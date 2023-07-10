const Course = require('../../models/Course');

/**
 * Create a new course.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the course is created successfully.
 */
const createCourse = async (req, res) => {
  try {
    const { courseId, name, description, courseCode, materials } = req.body;

    const newCourse = new Course({
      courseId,
      name,
      description,
      courseCode,
      materials,
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      message: 'Course created successfully',
      course: savedCourse,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ message: 'Failed to create course' });
  }
};

module.exports = createCourse;
