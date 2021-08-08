const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Login = mongoose.model('Login')

exports.bauth = (email, password) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await Login.findOne({ email }).select('password')

      bcrypt.compare(password, user.password, async (err, isMatch) => {
        if(err) throw err
        if(!isMatch) rej('Authentication error')
        const toSend = await Login.findOne({ email }).select(['-_id', '-updatedAt', '-createdAt', '-__v'])
        res(toSend)
      })
    } catch(err) {
      rej('Authentication error')
    }
  })
}
