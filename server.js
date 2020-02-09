import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import routes from './routes/index'
import Settings from './config'
import { applyResponseHelpers } from './middlewares/response.middleware'

/** Connect With MongoDB */
mongoose.connect(`${Settings.mongo.url}/${Settings.mongo.db}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

/** Initialize Express App */
const app = express();

app.use(cors())

/** Apply BodyParser Middleware */
app.use(bodyParser.json())

/** Response Helpers */
applyResponseHelpers(app)

/** Initialize API Routes */
app.use('/api', routes)

/**
 *  Server Over HTTPS  (Generate Self-Signed Certificates for your domain)
*/
app.listen(Settings.port, () => {
  console.log(`Server started listening on Port ${Settings.port}`)
})