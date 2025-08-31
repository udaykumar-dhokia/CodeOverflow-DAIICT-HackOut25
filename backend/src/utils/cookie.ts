import { CookieOptions } from "express";

export const jwtCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 1000 * 60 * 60 * 24,
};
