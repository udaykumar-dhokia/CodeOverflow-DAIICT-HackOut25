import HttpStatus from "../../utils/httpStatus";
import Solar, { SolarInterface } from "../solar/solar.model"

const SolarController = {
  // Create a new solar record
  create: async (req, res) => {
    const { latitude, longitude, unit } = req.body;

    // Validate required fields
    if (latitude === undefined || longitude === undefined || unit === undefined) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields: latitude, longitude, or unit." });
    }

    try {
      const solar = new Solar({
        latitude,
        longitude,
        unit,
      });
      const savedSolar = await solar.save();
      return res
        .status(HttpStatus.CREATED)
        .json({ message: "Solar record created successfully", solar: savedSolar });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error." });
    }
  },
  getAll: async (req, res) => {
    try {
      const solars = await Solar.find();
      return res
        .status(HttpStatus.OK)
        .json({ message: "Solar records retrieved successfully", solars });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error." });
    }
  },
};

export default SolarController;