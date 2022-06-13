const bcrypt = require('bcryptjs')
import dbConnect from './dbConnect'
import Login from './models/Login'

const bauth = (email, password) => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    let user
    try {
      user = await Login.findOne({ email }).select('password')
      if(user === null) rej('User not found.')
    } catch(err) {
      rej(err)
    }
   
    try {
      bcrypt.compare(password, user.password, async (err, isMatch) => {
        if(err) throw err
        if(!isMatch) rej('Check your password.')
        const toSend = await Login.findOne({ email }).select(['-_id', '-updatedAt', '-createdAt', '-__v'])
        res(toSend)
      })
    } catch(err) {
      rej(err)
    }
  })
}

export default bauth
