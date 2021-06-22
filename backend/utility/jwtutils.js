const jwt = require('jsonwebtoken')
const Blacklist =  require('../models/Blacklist')

exports.getID = async (bearer) => {
  return new Promise(async (res, rej) => {
    try {
      const token = bearer.split(' ')[1]
      const id = await jwt.verify(token, process.env.APP_SECRET)
      res(id._id)
    } catch(err) {
      rej('db error')
    }
  })
}

exports.isExpired = async (bearer) => {
  return new Promise(async (res, rej) => {
    try {
      const token = bearer.split(' ')[1]
      const exists = await Blacklist.find({ token })
      if(exists.length) {
        res(true)
      } else {
        res(false)
      }
    } catch(err) {
      rej('db error')
    }
  })
}
