require('dotenv').config()
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Login = require('../models/Login')
const Owner = require('../models/Owner')
const impowner = require('./owner')

const saveOwner = (login, owner) => {
  return new Promise( (res, rej) => {
    const { handle,
            firstName,
            middleName,
            lastName,
            location,
            bio,
            avatar } = owner

    const { email,
            password } = login

    const newlogin = new Login({
      email,
      password
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newlogin.password, salt, async (err, hash) => {
        newlogin.password = hash

        try {
          console.log(await newlogin.save())
        } catch(err) {
          console.log(err)
        }

        let newOwner
        try {
          newOwner = new Owner({
            handle,
            firstName,
            middleName,
            lastName,
            avatar
          })
          console.log(await newOwner.save())
          res(true)
        } catch(err) {
          console.log(err)
          rej(false)
        }
      })
    })
  })
}

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const doAdd = async () => {
  try {
    if(await saveOwner(impowner.newowner.login, impowner.newowner.owner)) process.exit()
  } catch(err) {
    console.log('something happened in add')
    console.log(err)
    process.exit()
  }
}

mongoose.connection.once('open', async () => {
  try {
    await doAdd()
  } catch(err) {
    console.log('something happened in connection')
    console.log(err)
    process.exit()
  }
})
