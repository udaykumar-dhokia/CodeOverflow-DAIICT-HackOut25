import HttpStatus from "../../utils/httpStatus";
import Wind from "../wind/wind.model"

const WindController = {
  // Create a new wind record
  create: async (req, res) => {
    const { latitude, longitude, speed } = req.body;

    if (latitude === undefined || longitude === undefined || speed === undefined) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields: latitude, longitude, or speed." });
    }

    try {
      const wind = new Wind({
        latitude,
        longitude,
        speed,
      });
      const savedWind = await wind.save();
      return res
        .status(HttpStatus.CREATED)
        .json({ message: "Wind record created successfully", wind: savedWind });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error." });
    }
  },

  // Get all wind records
  getAll: async (req, res) => {
    try {
      const winds = await Wind.find();
      return res
        .status(HttpStatus.OK)
        .json({ message: "Wind records retrieved successfully", winds });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error." });
    }
  },
};

export default WindController;