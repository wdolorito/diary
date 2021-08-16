const jwt = require('jsonwebtoken')
const Login = require('../models/Login')
const Blacklist =  require('../models/Blacklist')
const TokenWhitelist =  require('../models/TokenWhitelist')

exports.getUser = async () => {
  return new Promise(async (res, rej) => {
    try {
      const id = await Login.find({}).sort({ "createdAt": -1 })
      res(id[0].email)
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

exports.blacklistJwt = async (bearer) => {
  return new Promise(async (res, rej) => {
    try {
      const token = bearer.split(' ')[1]
      const resp = new Blacklist({ token })
      await resp.save()
      res(resp)
    } catch(err) {
      rej('db error')
    }
  })
}

exports.tokenIsExpired = async (token) => {
  return new Promise(async (res, rej) => {
    try {
      const exists = await TokenWhitelist.find({ token })
      if(exists.length) {
        res(false)
      } else {
        res(true)
      }
    } catch(err) {
      rej('db error')
    }
  })
}

exports.removeToken = async (token) => {
  return new Promise(async (res, rej) => {
    try {
      const resp = await TokenWhitelist.deleteOne({ token })
      res(resp)
    } catch(err) {
      rej('db error')
    }
  })
}

exports.genToken = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
