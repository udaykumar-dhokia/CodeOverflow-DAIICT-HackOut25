import HttpStatus from "../../../utils/httpStatus";
import userDao, { UserType } from "../company/user.dao"; 
import dotenv from "dotenv";
import { CookieOptions } from "express";
import { comparePassword, hashPassword } from "../../../utils/hash";
import { setToken } from "../../../utils/jwt";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

const AuthController2 = {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }

    try {
      const company = await userDao.findByEmail(email);
      if (!company || !(await comparePassword(password, company.password))) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Invalid credentials." });
      }
      const token = setToken(company._id.toString());
      res.cookie("token", token, cookieOptions);
      return res
        .status(HttpStatus.OK)
        .json({ message: "Login successful.", company, token });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error." });
    }
  },

  register: async (req, res) => {
    const {
      name,
      website,
      GSTIN,
      about_us,
      company_size,
      location,
      email,
      contact,
      password,
      asset_type,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !website ||
      !about_us ||
      !company_size ||
      !location ||
      !email ||
      !contact ||
      !password ||
      !asset_type
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }

    try {
      const hashedPassword = await hashPassword(password);
      const payload: UserType = {
        name,
        website,
        GSTIN,
        about_us,
        company_size,
        location,
        email,
        contact,
        password: hashedPassword,
        asset_type,
        latitude,
        longitude,
      };
      const exists = await userDao.findByEmail(email);
      if (exists) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ message: "Company already exists." });
      }
      const company = await userDao.create(payload);
      const token = setToken(company._id.toString());
      if (!token) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal Server Error." });
      }
      res.cookie("token", token, cookieOptions);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: "Registration successful", company });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error." });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });

      return res.status(HttpStatus.OK).json({ message: "Logout successful." });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to log out." });
    }
  },
};

export default AuthController2;