import express from "express";
import AuthController from "./project_developer/auth.controller";
import AuthController2 from "./company/auth.controller";
import projectDeveloperMiddleware from "../../middlewares/project-developer-middleware";
import companyMiddleware from "../../middlewares/company.middleware";
const router = express.Router();
router.post("/project-developer/register", AuthController.register);
router.post("/project-developer/login", AuthController.login);
router.post("/project-developer/logout", AuthController.logout);
router.get(
  "/project-developer/exists",
  projectDeveloperMiddleware,
  AuthController.exists
);
router.get("/company/exists", companyMiddleware, AuthController2.exists);
router.post("/company/register", AuthController2.register);
router.post("/company/login", AuthController2.login);
router.post("/company/logout", AuthController2.logout);

export default router;
