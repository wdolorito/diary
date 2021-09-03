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

    res.send(204)
    next()
  })

  server.post('/refresh', async (req, res, next) => {
    const { token } = req.body
    try {
      if(await utils.tokenIsExpired(token)) {
        return next(new errors.InvalidCredentialsError('refresh token invalid'))
      }
    } catch(err) {
      return next(new errors.InternalError(err))
    }

    try {
      await utils.removeToken(token)
    } catch(err) {
      return next(new errors.InvalidCredentialsError('refresh token invalid'))
    }

    let email,
        refresh

    try {
      email = await utils.getUser()
    } catch(err) {
      return next(new errors.InternalError(err))
    }

    const newjwt = jwt.sign({ email }, process.env.APP_SECRET, { expiresIn: '10m' })

    try {
      refresh = utils.genToken()
      const tokenwhitelist = new TokenWhitelist({ token: refresh })
      await tokenwhitelist.save()
    } catch(err) {
      return next(new errors.InternalError('unable to generate refresh token'))
    }

    res.send({ token: newjwt, refresh })
    next()
  })
}
