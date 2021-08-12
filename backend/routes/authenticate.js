const bcrypt = require('bcryptjs')
const errors = require('restify-errors')
const jwt = require('jsonwebtoken')
const Blacklist = require('../models/Blacklist')
const TokenWhitelist = require('../models/TokenWhitelist')
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
  TokenWhitelist.init()
  Login.init()

  server.post('/login', async (req, res, next) => {
    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError('Data not sent correctly'))
    }

    const { email, password } = req.body

    let user,
        refresh

    try {
      user = await bauth.bauth(email, password)
    } catch(err) {
      return next(new errors.UnauthorizedError(err))
    }

    const token = jwt.sign(user.toJSON(), process.env.APP_SECRET, { expiresIn: '10m' })

    try {
      refresh = utils.genToken()
      const tokenwhitelist = new TokenWhitelist({ token: refresh })
      await tokenwhitelist.save()
    } catch(err) {
      return next(new errors.InternalError('unable to generate refresh token'))
    }

    res.send({ token, refresh })
    next()
  })

  server.post('/logout', async (req, res, next) => {
    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError('Data not sent correctly'))
    }

    const resToken = req.headers.authorization
    const { token } = req.body

    try {
      await utils.blacklistJwt(resToken)
    } catch(err) {
      return next(new errors.InternalError('unable to add jwt'))
    }

    try {
      await utils.removeToken(token)
    } catch(err) {
      return next(new errors.InternalError('unable to remove refresh token'))
    }

    res.send(200, 'logged out')
    next()
  })

  server.post('/refresh', async (req, res, next) => {
    const resToken = req.headers.authorization
    const { token } = req.body
    try {
      const tokenExpired = await utils.tokenIsExpired(token)
      if(tokenExpired) {
        return next(new errors.InvalidCredentialsError('refresh token invalid'))
      }
    } catch(err) {
      return next(new errors.InternalError(err))
    }

    try {
      const user = await utils.getUser(resToken)
      const payload = {}
      payload.email = user
      const token = jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '10m' })
      res.send({ token })
      next()
    } catch(err) {
      return next(new errors.InternalError(err))
    }
  })
}
