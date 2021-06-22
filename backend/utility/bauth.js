const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const canDelete = (sent, todel, type, isSame) => {
  switch(type) {
    case 'user':
      if(sent === 'master' & !isSame) return true

      if(sent === 'admin') {
        if(todel !== 'master') {
          if(isSame) return true
          if(todel !== 'admin') return true
        }
      }

      if(sent === 'user' & isSame) return true

      return false
      break
    case 'post':
      if(sent === 'master') return true

      if(sent === 'admin') {
        if(todel !== 'master') {
          if(isSame) return true
          if(todel !== 'admin') return true
        }
      }

      if(sent === 'user' & isSame) return true

      return false
      break
    default:
      return false
  }
}

const canUpdate = (sent, toup, type, isSame) => {
  switch(type) {
    case 'user':
      if(sent === 'master') return true

      if(sent === 'admin') {
        if(toup !== 'master') {
          if(isSame) return true
          if(toup !== 'admin') return true
        }
      }

      if(sent === 'user' & isSame) return true

      return false
      break
    case 'post':
      if(sent === 'master') return true

      if(sent === 'admin') {
        if(toup !== 'master')  return true
      }

      if(sent === 'user' & isSame) return true

      return false
      break
    default:
      return false
  }
}

const isAdmin = (id) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findOne({ _id: id }).select('isAdmin')
      res(user.isAdmin)
    } catch(err) {
      rej('db error')
    }
  })
}

const isMaster = (id) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findOne({ _id: id }).select('isMaster')
      res(user.isMaster)
    } catch(err) {
      rej('db error')
    }
  })
}

exports.bauth = (email, password) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findOne({ email }).select('password')

      bcrypt.compare(password, user.password, async (err, isMatch) => {
        if(err) throw err
        if(!isMatch) rej('Authentication error')
        const toSend = await User.findOne({ email }).select('-__v')
        res(toSend)
      })
    } catch(err) {
      rej('Authentication error')
    }
  })
}

exports.canAction = (sid, did, act, type) => {
  // sid = id from header
  // did = id sent in body
  // act = action, delete or update
  // type = type, user or post

  return new Promise(async (res, rej) => {
    let sent, towork, isSame = (sid === did)
    try {
      sent = await exports.whoAmI(sid)
      towork = await exports.whoAmI(did)
    } catch(err) {
      rej('db error')
    }

    switch(act) {
      case 'delete':
        res(canDelete(sent, towork, type, isSame))
        break
      case 'update':
        res(canUpdate(sent, towork, type, isSame))
        break
      default:
        rej('db error')
    }
  })
}

exports.whoAmI = (id) => {
  return new Promise(async (res, rej) => {
    let admin
    try {
      admin = await isAdmin(id)
    } catch(err) {
      rej('db error')
    }

    try {
      if(admin == true) {
        if(await isMaster(id) == true) res('master')
        res('admin')
      }
      res('user')
    } catch(err) {
      rej('db error')
    }
  })
}
