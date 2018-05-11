import express from 'express'
import expressGraphQL from 'express-graphql'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import connectRedis from 'connect-redis'

import configPassport from './middlewares/passport'
import schema from './schema'
import { PUBLIC_PATH, SERVER_PORT, DB_PATH, SESSION_SECRET } from './config'

const isProd = process.env.NODE_ENV === 'production'

mongoose.Promise = global.Promise

const app = express()
const RedisStore = connectRedis(session)

app.use(cors({}))

app.set('x-powered-by', false)
app.use(morgan('dev'))

app.use(express.static(PUBLIC_PATH))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  store: new RedisStore,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: SESSION_SECRET
}))
configPassport(app)

app.use('/graphql', expressGraphQL((req) => ({
  schema,
  graphiql: !isProd,
  // context: { user: req.user}
  formatError: ({ message, locations, stack, path }) => !isProd
    ? ({ message, locations, path, stack })
    : ({ message })
})))

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'page not found' })
})

// fall safe, catch all error
app.use((err, req, res, next) => {
  console.log('error happened:', err)
  res.status(err.status || 500).json({ message: err.toString() })
})

const startServer = () => app.listen(SERVER_PORT, () => {
  console.log(`server started at port: ${SERVER_PORT}`)
})

mongoose
  .connect(DB_PATH)
  .then(
    () => console.log(`mongo started at port: ${DB_PATH}`),
    (e) => console.log('mongo error:', e)
  )
  .then(startServer)
