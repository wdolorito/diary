require('dotenv').config()
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Login = require('../models/Login')
const Owner = require('../models/Owner')
const Static = require('../models/Static')
const impowner = require('./owner')
const impabout = require('./about')

const saveOwner = (login, owner) => {
  return new Promise( (res, rej) => {
    const { handle,
            firstName,
            middleName,
            lastName,
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
          process.exit()
        }

        let newOwner
        try {
          newOwner = new Owner({
            owner: newlogin._id,
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

const seedSection = async (section, body) => {
  const static = new Static({
    section,
    body
  })

  try {
    console.log(await static.save())
  } catch(err) {
    console.log(err)
  }
}

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const doAdd = async () => {
  try {
    await saveOwner(impowner.newowner.login, impowner.newowner.owner)
  } catch(err) {
    console.log('owner wasn\'t saved')
    console.log(err)
  }

  try {
    await seedSection(impabout.about.section, impabout.about.body)
  } catch(err) {
    console.log(impabout.about.section + ' wasn\'t seeded')
    console.log(err)
  }
}

mongoose.connection.once('open', async () => {
  try {
    await doAdd()
  } catch(err) {
    console.log('something happened in connection')
    console.log(err)
  }

  process.exit()
})
