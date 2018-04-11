const passport = require('passport')

const loginHOC = fn => requireLogoutHOC((...args) => {
  const { username, password } = args[1]
  const req = args[2]

  return new Promise((res, rej) => {
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

        res(fn(...args))
      })
    })({ body: { username, password } })
  })
})

const requireLoginHOC = fn => (...args) => {
  const req = args[2]
  if (!req.isAuthenticated()) {
    throw Error('Please Login first.')
  }

  return fn(...args)
}

const requireLogoutHOC = fn => (...args) => {
  const req = args[2]
  if (req.isAuthenticated()) {
    throw Error('Already logged in.')
  }

  return fn(...args)
}

module.exports = {
  requireLoginHOC,
  requireLogoutHOC,
  loginHOC,
  // requireUserAuth,
  // requireRatingAuth
}
