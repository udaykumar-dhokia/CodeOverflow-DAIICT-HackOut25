import express from 'express'
import WindController from './wind.controller'
const router = express.Router()
router.get('/get-all', WindController.getAll)
router.post('/create', WindController.create)
export default router