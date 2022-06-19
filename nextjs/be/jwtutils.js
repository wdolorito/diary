const jwt = require('jsonwebtoken')
import dbConnect from './dbConnect'
import Blacklist from './models/Blacklist'
import Login from './models/Login'
import TokenWhitelist from './models/TokenWhitelist'

const expiresIn = '10m'

const getUser = () => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    await Login.find({})
               .sort({ "createdAt": -1 })
               .exec((err, users) => {
                 if(err) rej('No one here. ' + err)
                 res(users[0].email)
               })
  })
}

const getToken = bearer => {
  if(bearer) {
    const auth = bearer.split(' ')[1]
    return auth
  }
  return null
}

const isExpired = bearer => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    const token = getToken(bearer)

    try {
      jwt.verify(token, process.env.APP_SECRET)
    } catch(err) {
      rej(err)
    }

    const exists = await Blacklist.findOne({ token })
    if(exists === null) res(false)
    rej(true)
  })
}

const blacklistJwt = bearer => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const token = getToken(bearer)
      const resp = new Blacklist({ token })
      await resp.save()
      res(resp)
    } catch(err) {
      rej('Unable to blacklist jwt.')
    }
  })
}

const tokenIsExpired = token => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    const exists = await TokenWhitelist.findOne({ token })
    if(exists === null) {
      rej(true)
    } else {
      res(false)
    }
  })
}

const removeToken = token => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    const resp = await TokenWhitelist.deleteOne({ token })
    const { deletedCount } = resp
    if(deletedCount) {
      res(deletedCount)
    } else {
      rej('I can haz refresh token?')
    }
  })
}

const genRefresh = async () => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    const refresh = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })

  try {
    const tokenwhitelist = new TokenWhitelist({ token: refresh })
    await tokenwhitelist.save()
  
    res(refresh)
  } catch(err) {
    rej(err)
  }
  })
}

const genToken = data => {
  return jwt.sign(data, process.env.APP_SECRET, { expiresIn })
}

const jwtutils = {
                   getUser,
                   isExpired,
                   blacklistJwt,
                   tokenIsExpired,
                   removeToken,
                   genToken,
                   genRefresh
                 }

export default jwtutils
