const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
