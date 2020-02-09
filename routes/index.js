import express from 'express'
import AuthRoutes from './auth.route'

const router = express.Router()
router.use('/auth', AuthRoutes)

export default router