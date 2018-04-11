const path = require('path')
const express = require('express')
const expressGraphQL = require('express-graphql')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const morgan = require('morgan')
const cors = require('cors')
// const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const configPassport = require('./middlewares/passport')
const schema = require('./schema')
const { PUBLIC_PATH, SERVER_PORT, DB_PATH } = require('./config')
const isProd = process.env.NODE_ENV === 'production'

const app = express()

if (!isProd) {
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }))
}

app.set('x-powered-by', false)
app.use(morgan('dev'))

app.use(express.static(PUBLIC_PATH))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: '!@#$%^&*'
}))
configPassport(app)

app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: !isProd,
  // context: { user: req.user}
  formatError: ({ message, locations, stack, path }) => !isProd
    ? ({ message, locations, path, stack })
    : ({ message})
})))

// 404 handler, return main page, let front-end router handles.
app.use('*', (req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_PATH, './index.html'))
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
  .connect(DB_PATH, { useMongoClient: true, autoIndex: true })
  .then(
    () => console.log(`mongo started at port: ${DB_PATH}`),
    e => console.log('mongo error:', e)
  )
  .then(startServer)
