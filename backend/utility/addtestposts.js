require('dotenv').config()
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')
const impposts = require('./seedposts')

const savePost = (post) => {
  return new Promise(async (res, rej) => {
    let postowner
    try {
      const owner = await User.findOne({ email: post.owner })
      postowner = owner._id
    } catch(err) {
      rej('add test users first')
    }

    const newpost = new Post({
      owner: postowner,
      title: post.title,
      body: post.body
    })

    try {
      console.log(await newpost.save())
      res(true)
    } catch(err) {
      rej('db error')
    }
  })
}

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true
})

const doAdd = async () => {
  try {
    await savePost(impposts.posts.user1testpost1)
    await savePost(impposts.posts.user1testpost2)
    await savePost(impposts.posts.user2testpost1)
    if(await savePost(impposts.posts.user2testpost2)) process.exit()
  } catch(err) {
    console.log(err)
  }
}

mongoose.connection.once('open', async () => {
  try {
    await doAdd()
  } catch(err) {
    console.log('something happened')
  }
})
