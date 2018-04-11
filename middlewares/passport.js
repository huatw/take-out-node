const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User } = require('../models')

function configPassport (app) {
  passport.use(new LocalStrategy(
    async (username, cleanPassword, verified) => {
      try {
        const user = await User.load(username)

        if (user && await user.comparePassword(cleanPassword)) {
          return verified(null, user)
        }
        const err = Error('Invaild password or username.')

        return verified(null, false, err)
      } catch (e) {
        verified(e)
      }
    }
  ))

  // pass username to `deserializeUser`
  passport.serializeUser((user, cb) => {
    cb(null, user.username)
  })

  // set value to `req.user`
  passport.deserializeUser(async (username, cb) => {
    try {
      const user = await User.load(username)
      cb(null, user)
    }
    catch (e) {
      cb(e)
    }
  })

  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports = configPassport