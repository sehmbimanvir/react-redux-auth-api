import UserModal from '../models/user.model'
import { generteAuthPayload, generateRandomString } from '../utils'
import bcrypt from 'bcryptjs'
import { sendPasswordResetEmail, sendConfirmationEmail } from '../emails'

export const register = async (req, res) => {
  const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  const { email, name } = req.body
  const confirm_token = generateRandomString(20)
  const User = new UserModal({ name, email, password, confirm_token })

  try {
    const user = await User.save()
    const emailData = user.toJSON()
    emailData.confirm_token = confirm_token

    // Send Confirmation Email
    await sendConfirmationEmail(emailData.email, emailData)

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

  if (!user.status)
    return res.jsonResponse('User is inactive', {}, 400)

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

export const verifyResetToken = async (req, res) => {
  const { reset_token } = req.params
  try {
    const count = await UserModal.countDocuments({ reset_token })

    if (!count)
      return res.jsonResponse('Invalid Token', {}, 404)

    return res.jsonResponse('Token Found')
  } catch (err) {
    return res.jsonError(err)
  }
}

export const resetPassword = async (req, res) => {
  const { reset_token } = req.params
  const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  const user = await UserModal.findOne({ reset_token })

  if (bcrypt.compareSync(req.body.password, user.password)) {
    return res.jsonResponse('New password cannot be same as old password.', {}, 400)
  }

  if (!user)
    return res.jsonResponse('User Not Found', {}, 404)

  try {
    await UserModal.findByIdAndUpdate(user, { password, $unset: { reset_token } })
    res.jsonResponse('Password has been changed')
  } catch (err) {
    res.jsonError(err)
  }
}

export const verifyConfirmationToken = async (req, res) => {
  const { confirm_token } = req.params
  try {
    const user = await UserModal.findOneAndUpdate({ confirm_token }, { status: 1, $unset: { confirm_token } }, { new: true })

    if (!user)
      return res.jsonResponse('Invalid Verification Token', {}, 404)

    return res.jsonResponse('Token Found', user)
  } catch (err) {
    return res.jsonError(err)
  }
}

export const logout = (req, res) => {
  res.jsonResponse('Logged out Successfully')
}