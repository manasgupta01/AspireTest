const mongoose = require("mongoose");

// Define the course schema
const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true }, // Course ID
  name: { type: String, required: true }, // Course name
  description: { type: String, required: true }, // Course description
  courseCode: { type: String, required: true }, // Course code
  materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }], // Array of material references
  enrolledStudents: [{ type: String, ref: 'User' }], // Array of enrolled student references
});

// Create the Course model
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
