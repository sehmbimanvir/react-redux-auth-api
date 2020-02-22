import Mailer from '../services/mailer.service'
import Settings from '../config'

export const sendPasswordResetEmail = (email, data) => {
  return new Promise((resolve, reject) => {
    const emailData = {
      from: Settings.mail.from,
      to: email,
      subject: 'Reset Password Link',
      template: 'passwordResetToken',
      context: {
        data,
        site: Settings.site
      }
    }

    Mailer.sendMail(emailData, (err, response) => {
      if (err)
        return reject(err)

      return resolve(response)
    })
  })
}

export const sendConfirmationEmail = (email, data) => {
  return new Promise((resolve, reject) => {
    const emailData = {
      from: Settings.mail.from,
      to: email,
      subject: 'Confirmation Email',
      template: 'confirmationEmail',
      context: {
        data,
        site: Settings.site
      }
    }

    Mailer.sendMail(emailData, (err, response) => {
      if (err)
        return reject(err)

      return resolve(response)
    })
  })
}