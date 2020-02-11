import express from 'express'
import {
  login,
  register,
  logout,
  resetPassword,
  forgotPassword,
  verifyResetToken
} from '../controllers/auth.controller'
import { validateToken } from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot', forgotPassword)
router.post('/verify-reset-token/:reset_token', verifyResetToken)
router.post('/reset/:reset_token', resetPassword)
router.post('/logout', validateToken, logout)

export default router