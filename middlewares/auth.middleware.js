import jwt from 'jsonwebtoken'
import Settings from '../config';

const verifyJWT = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, Settings.jwt.secret, (err, decoded) => {
      if (err)
        return reject(err)

      resolve(decoded)
    })
  })
}

export const validateToken = async (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return res.jsonResponse('No Token Provided')
  }

  try {
    const result = await verifyJWT(token)
    req.user = () => result
    next()
  } catch (e) {
    return res.jsonError(e)
  }
}