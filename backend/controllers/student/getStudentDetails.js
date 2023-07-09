// controllers/student/getStudentDetails.js

const Student = require("../../models/User");

const getStudentDetails = async (req, res) => {
  try {
    // Extract the student email from the request parameters
    const { email } = req.params;

    // Find the student by their email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Return the student details
    res.status(200).json({ student });
  } catch (error) {
    console.error("Error retrieving student details:", error);
    res.status(500).json({ message: "Failed to retrieve student details" });
  }
};

module.exports = getStudentDetails;
