const bcrypt = require('bcryptjs')
const errors = require('restify-errors')
const jwt = require('jsonwebtoken')
const Blacklist = require('../models/Blacklist')
const Post = require('../models/Post')
const User = require('../models/User')
const UserData = require('../models/UserData')
const bauth = require('../utility/bauth')
const utils = require('../utility/jwtutils')

const getUser = (id) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findById(id).select('-__v')
      const userdata = await UserData.findOne({ owner: user._id }).select('-_id -__v')
      const payload = []
      payload.push(user)
      if(userdata != null) payload.push(userdata)
      res(payload)
    } catch(err) {
      rej(err)
    }
  })
}

const getUsers = (arr) => {
  return new Promise(async (res, rej) => {
    try {
      let payload = []
      for(let count = 0; count < arr.length; count++) {
        payload.push(await getUser(arr[count]._id))
      }
      res(payload)
    } catch(err) {
      rej(err)
    }
  })
}

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
  User.init()

  server.post('/login', async (req, res, next) => {
    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError('Data not sent correctly'))
    }

    const { email, password } = req.body

    try {
      const user = await bauth.bauth(email, password)
      const token = jwt.sign(user.toJSON(), process.env.APP_SECRET, { expiresIn: '30m' })
      const { _id, iat, exp } = jwt.decode(token)
      const luser = await getUser(_id)
      const whoami = await bauth.whoAmI(_id)
      res.send({ iat, exp, token, luser, whoami })
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

  server.get('/user/:id', async (req, res, next) => {
    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.UnauthorizedError('Not authorized'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    try {
      res.send(await getUser(req.params.id))
      next()
    } catch(err) {
      return next(new errors.ResourceNotFoundError('User does not exist'))
    }
  })
}
