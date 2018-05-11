import passport from 'passport'

export const login = ({ req, username, password }) => new Promise((resolve, reject) => {
  passport.authenticate('local', (e, user, message) => {
    if (e) {
      return reject(e)
    }

    if (!user) {
      return reject(message)
    }

    req.login(user, (err) => {
      if (err) {
        return reject(err)
      }

      resolve(req.user)
    })
  })({ body: { username, password } })
})

export const requireLoginHOF = fn => (...args) => {
  const req = args[2]

  if (!req.isAuthenticated()) {
    throw Error('Please Login first.')
  }

  return fn(...args)
}

export const requireLogoutHOF = fn => (...args) => {
  const req = args[2]
  if (req.isAuthenticated()) {
    throw Error('Already logged in.')
  }

  return fn(...args)
}
