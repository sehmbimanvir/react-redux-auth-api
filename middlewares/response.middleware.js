export const applyResponseHelpers = (app) => {

  /** Normal Json Response */
  app.use((req, res, next) => {
    res.jsonResponse = (message, data = null, status = 200) => {
      res.status(status).json({ message, data })
    }
    next()
  })

  /** For Handling Errors */
  app.use((req, res, next) => {
    res.jsonError = (error, defaultMsg = null) => {
      let response = { status: 400, message: error.errmsg, data: null }
      if (error.name === "ValidationError") {
        response.status = 422;
        response.message = 'Validation Failed'
        response.data = error.errors
      } else if (error.name === 'JsonWebTokenError') {
        response.status = 401;
        response.message = 'Unauthorized'
      }
      res.status(response.status).json(response)
    }
    next()
  })
}