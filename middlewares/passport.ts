import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User, { IUser } from '../models/User'

function configPassport (app: express.Express): void {
  passport.use(new LocalStrategy(
    async (username: string, cleanPassword: string, verified) => {
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

  // interface IUser {
  //   username: string
  // }

  // pass username to `deserializeUser`
  passport.serializeUser((user: IUser, cb) => {
    cb(null, user.username)
  })

  // set value to `req.user`
  passport.deserializeUser(async (username: string, cb) => {
    try {
      const user = await User.load(username)
      cb(null, user)
    } catch (e) {
      cb(e)
    }
  })

  app.use(passport.initialize())
  app.use(passport.session())
}

export default configPassport
