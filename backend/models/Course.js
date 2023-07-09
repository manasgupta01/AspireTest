const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  courseCode: { type: String, required: true },
  materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
  enrolledStudents: [{ type: String, ref: 'User' }],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
