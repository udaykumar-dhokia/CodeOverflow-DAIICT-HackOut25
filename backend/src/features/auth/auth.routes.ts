import express from 'express'
import AuthController from './project_developer/auth.controller'
const router = express.Router()
router.post('/project-developer/register', AuthController.register)
router.post('/project-developer/login', AuthController.login)
router.post('/project-developer/logout', AuthController.logout)
export default router