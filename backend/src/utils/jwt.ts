import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const setToken = async (id: string) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const data = jwt.verify(token, JWT_SECRET);

  return data;
};
