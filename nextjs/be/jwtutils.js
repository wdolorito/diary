const jwt = require('jsonwebtoken')
import dbConnect from './dbConnect'
import Blacklist from './models/Blacklist'
import TokenWhitelist from './models/TokenWhitelist'

const getToken = bearer => {
  return bearer.split(' ')[1]
}

const isExpired = bearer => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const token = getToken(bearer)
      const exists = await Blacklist.find({ token })
      if(exists.length) {
        res(true)
      } else {
        res(false)
      }
    } catch(err) {
      rej('Unable to determine token state.')
    }
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
      rej('Unable to blacklist token.')
    }
  })
}

const tokenIsExpired = token => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const exists = await TokenWhitelist.find({ token })
      if(exists.length) {
        res(false)
      } else {
        res(true)
      }
    } catch(err) {
      rej('Unable to determine token expiration.')
    }
  })
}

const removeToken = token => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const resp = await TokenWhitelist.deleteOne({ token })
      res(resp)
    } catch(err) {
      rej('Unable to remove token.')
    }
  })
}

const genToken = async () => {
  const refresh = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })

  const tokenwhitelist = new TokenWhitelist({ token: refresh })
  await tokenwhitelist.save()

  return refresh
}

const genRefresh = data => {
  return jwt.sign(data.toJSON(), process.env.APP_SECRET, { expiresIn: '10m' })
}

const jwtutils = {
                   isExpired,
                   blacklistJwt,
                   tokenIsExpired,
                   removeToken,
                   genToken,
                   genRefresh
                 }

export default jwtutils
