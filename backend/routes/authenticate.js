const bcrypt = require('bcryptjs')
const errors = require('restify-errors')
const jwt = require('jsonwebtoken')
const Blacklist = require('../models/Blacklist')
const TokenBlacklist = require('../models/TokenBlacklist')
const Login = require('../models/Login')
const bauth = require('../utility/bauth')
const utils = require('../utility/jwtutils')

const hashPass = (plain) => {
  return new Promise((res, rej) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(plain, salt, (err, hash) => {
        if(hash) {
          res(hash)
        } else {
          rej('error')
        }
      })
    })
  })
}

module.exports = server => {
  Blacklist.init()
  TokenBlacklist.init()
  Login.init()

  server.post('/login', async (req, res, next) => {
    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError('Data not sent correctly'))
    }

    const { email, password } = req.body

    try {
      const user = await bauth.bauth(email, password)
      const token = jwt.sign(user.toJSON(), process.env.APP_SECRET, { expiresIn: '10m' })
      const refresh = jwt.sign(user.toJSON(), process.env.APP_SECRET, { expiresIn: '86400m' })
      res.send({ token, refresh })
      next()
    } catch(err) {
      return next(new errors.UnauthorizedError(err))
    }
  })

  server.post('/logout', async (req, res, next) => {
    try {
      const resToken = req.headers.authorization
      const pToken = resToken.split(' ')[1]
      const newBlacklist = new Blacklist({ token: pToken })
      await newBlacklist.save()
      res.send(200, 'logged out')
      next()
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }
  })

  server.post('/refresh', async (req, res, next) => {
    const resToken = req.headers.authorization
    try {
      if(await utils.tokenIsExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('refresh token invalid'))
      }
    } catch(err) {
      return next(new errors.InternalError(err))
    }

    let pToken
    try {
      pToken = resToken.split(' ')[1]
      const newTokenBlacklist = new TokenBlacklist({ token: pToken })
      await newTokenBlacklist.save()
      next()
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    let decoded
    try {
      decoded = jwt.verify(pToken, process.env.APP_SECRET)
    } catch(err) {
      return next(new errors.InvalidCredentialsError('refresh token invalid'))
    }

    try {
      const email = decoded.email
      const user = { 'email': email }
      const token = jwt.sign(user, process.env.APP_SECRET, { expiresIn: '10m' })
      const refresh = jwt.sign(user, process.env.APP_SECRET, { expiresIn: '86400m' })
      res.send({ token, refresh })
      next()
    } catch(err) {
      return next(new errors.UnauthorizedError(err))
    }
  })
}
