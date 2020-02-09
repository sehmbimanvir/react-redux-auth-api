import UserModal from '../models/user.model'
import { generteAuthPayload, generateRandomString } from '../utils'
import bcrypt from 'bcryptjs'
import { sendPasswordResetEmail } from '../emails'

export const register = async (req, res) => {
  const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  const { email } = req.body
  const User = new UserModal({ email, password })

  try {
    const user = await User.save()
    res.jsonResponse('User Registered Successfully', user)
  } catch (err) {
    return res.jsonError(err)
  }
}

export const login = async (req, res) => {
  const credentials = { email: req.body.email }
  const user = await UserModal.findOne(credentials)

  if (!user || !bcrypt.compareSync(req.body.password, user.password))
    return res.jsonResponse('User Not Found', {}, 404)

  const data = generteAuthPayload(user)
  res.jsonResponse('Logged In Successfully', data)
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  const reset_token = generateRandomString(30)
  const user = await UserModal.findOneAndUpdate({ email }, { reset_token }, { new: true })

  if (!user)
    return res.jsonResponse('User Not Found', {}, 404)

  try {
    const response = await sendPasswordResetEmail(user.email, user.toJSON())
    res.jsonResponse('Password Reset Email Successfully Sent...', response)
  } catch (err) {
    res.jsonError(err)
  }
}

export const logout = (req, res) => {
  res.jsonResponse('Logged out Successfully')
}