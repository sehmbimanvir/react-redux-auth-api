import jwt from 'jsonwebtoken'
import Settings from './config'

export const generateRandomString = (length = 10) => {
  const string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const wordsLength = string.length
  let result = ''
  for (let i = 0; i < length; i++) {
    result += string[getRandomNumber(0, wordsLength)]
  }

  return result
}

export const getRandomNumber = (min, max) => {
  return Math.ceil(Math.random() * (max - min) + min) - 1;
}

export const generteAuthPayload = user => {
  const data = { user }

  /** Create Token From Payload */
  data.token = jwt.sign(data, Settings.jwt.secret, {
    expiresIn: Settings.jwt.expires_in,
    issuer: Settings.jwt.issuer
  })

  return data
}