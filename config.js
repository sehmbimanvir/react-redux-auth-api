import dotenv from 'dotenv'

dotenv.config()

const Settings = {
  port: process.env.APP_PORT,
  mongo: {
    url: process.env.MONGO_URL,
    db: process.env.MONGO_DB
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID
  },
  site: {
    front_url: process.env.APP_FRONT_URL
  }
}

export default Settings