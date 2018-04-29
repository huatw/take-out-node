const passport = require('passport')

const login = ({ req, username, password }) => new Promise((res, rej) => {
  passport.authenticate('local', (e, user, message) => {
    if (e) {
      return rej(e)
    }

    if (!user) {
      return rej(message)
    }

    req.login(user, (err) => {
      if (err) {
        return rej(err)
      }

      res(req.user)
    })
  })({ body: { username, password } })
})

const requireLoginHOF = fn => (...args) => {
  const req = args[2]

  if (!req.isAuthenticated()) {
    throw Error('Please Login first.')
  }

  return fn(...args)
}

const requireLogoutHOF = fn => (...args) => {
  const req = args[2]
  if (req.isAuthenticated()) {
    throw Error('Already logged in.')
  }

  return fn(...args)
}

module.exports = {
  requireLoginHOF,
  requireLogoutHOF,
  login,
}
