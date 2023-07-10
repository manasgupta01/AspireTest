const Material = require("../../models/Material");

/**
 * Retrieve the details of a material using its materialId.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the material details are retrieved.
 */
const getMaterialDetails = async (req, res) => {
  try {
    // Extract the materialId from the request parameters
    const { materialId } = req.params;

    // Find the material by its materialId
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Return the material details
    res.status(200).json({ material });
  } catch (error) {
    console.error("Error retrieving material details:", error);
    res.status(500).json({ message: "Failed to retrieve material details" });
  }
};

module.exports = getMaterialDetails;
