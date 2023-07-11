const mongoose = require("mongoose");

// Define the material schema
const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // Material name
  description: {
    type: String,
    required: true,
  }, // Material description
  url: {
    type: String,
    required: true,
  }, // Material URL
  filePath: {
    type: String,
    required: true,
  }, // Material file path
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

// Create the Material model
const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
