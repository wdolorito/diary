const bcrypt = require('bcryptjs')
import Login from './models/Login'

export default function bauth(email, password) {
  return new Promise(async (res, rej) => {
    try {
      const user = await Login.findOne({ email }).select('password')

      bcrypt.compare(password, user.password, async (err, isMatch) => {
        if(err) throw err
        if(!isMatch) rej('Authentication error.')
        const toSend = await Login.findOne({ email }).select(['-_id', '-updatedAt', '-createdAt', '-__v'])
        res(toSend)
      })
    } catch(err) {
      rej('Internal error.')
    }
  })
}
