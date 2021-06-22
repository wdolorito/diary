const errors = require('restify-errors')
const jwt = require('jsonwebtoken')
const Post = require('../models/Post')
const User = require('../models/User')
const UserData = require('../models/UserData')
const bauth = require('../utility/bauth')
const utils = require('../utility/jwtutils')

const getAuthor = (id) => {
  return new Promise(async (res, rej) => {
    try {
      const authorid = await User.findOne({ _id: id }).select('-__v')
      const authordata = await UserData.find({ owner: authorid._id }).select('-_id -__v')
      const author = {}
      const name = authordata[0].firstName + ' '
                   + authordata[0].middleName + ' '
                   + authordata[0].lastName
      author.author = name
      author.handle = authordata[0].handle
      res(author)
    } catch(err) {
      rej(err)
    }
  })
}

const fixPost = (toEdit) => {
  return new Promise(async (res, rej) => {
    try {
      const author = await getAuthor(toEdit.owner)

      const post = {}
      post.id = toEdit._id
      post.author = author.author
      post.handle = author.handle
      post.title = toEdit.title
      post.body = toEdit.body
      post.updatedAt = toEdit.updatedAt
      post.createdAt = toEdit.createdAt
      res(post)
    } catch(err) {
      rej(err)
    }
  })
}

module.exports = server => {
  Post.init()

  // CRUD operations -> post get put del
  server.post('/post', async (req, res, next) => {
    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('No authorization token was found'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError('Data not sent correctly'))
    }

    let user = '',
        userType = ''

    try {
      user = await utils.getID(resToken)
      userType = await bauth.whoAmI(user)
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    if(userType === 'user') {
      const { title, body } = req.body
      const post = new Post({
        owner: user,
        title,
        body
      })

      try {
        const newPost = await post.save()
        res.send(201, 'saved post')
        next()
      } catch(err) {
        return next(new errors.InternalError('db error'))
      }
    }

    return next(new errors.InternalError('unable to post'))
  })

  server.get('/posts', async (req, res, next) => {
    try {
      const tosend = []
      const posts = await Post.find().select('-__v')
      for(count = 0; count < posts.length; count++) {
        const post = await fixPost(posts[count])
        tosend.push(post)
      }

      res.send(tosend)
      next()
    } catch(err) {
      return next(new errors.InvalidContentError(err))
    }
  })

  server.get('/posts/byUser', async (req, res, next) => {
    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('No authorization token was found'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    try {
      const tosend = []
      const user = await utils.getID(resToken)
      const author = await getAuthor(user)
      const posts = await Post.find({ owner: user }).select('-__v')
      for(count = 0; count < posts.length; count++) {
        const post = {}
        post.id = posts[count]._id
        post.author = author.author
        post.handle = author.handle
        post.title = posts[count].title
        post.body = posts[count].body
        post.updatedAt = posts[count].updatedAt
        post.createdAt = posts[count].createdAt
        tosend.push(post)
      }
      res.send(tosend)
      next()
    } catch(err) {
      return next(new errors.InvalidContentError(err))
    }
  })

  server.get('/posts/byUser/:id', async (req, res, next) => {
    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('No authorization token was found'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    try {
      const tosend = []
      const user = req.params.id
      const author = await getAuthor(user)
      const posts = await Post.find({ owner: user }).select('-__v')
      for(count = 0; count < posts.length; count++) {
        const post = {}
        post._id = posts[count]._id
        post.author = author.author
        post.handle = author.handle
        post.title = posts[count].title
        post.body = posts[count].body
        post.updatedAt = posts[count].updatedAt
        post.createdAt = posts[count].createdAt
        tosend.push(post)
      }
      res.send(tosend)
      next()
    } catch(err) {
      return next(new errors.InvalidContentError(err))
    }
  })

  server.get('/post/:id', async (req, res, next) => {
    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('No authorization token was found'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    try {
      const post = await Post.findOne({ _id: req.params.id }).select('-__v')
      const author = await getAuthor(post.owner)
      const tosend = {}
      tosend._id = post._id
      tosend.author = author.author
      tosend.handle = author.handle
      tosend.title = post.title
      tosend.body = post.body
      tosend.updatedAt = post.updatedAt
      tosend.createdAt = post.createdAt
      res.send(tosend)
      next()
    } catch(err) {
      return next(new errors.ResourceNotFoundError('Post not found'))
    }
  })

  server.put('/post/:id', async (req, res, next) => { // 200 req
    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError('Data not sent correctly'))
    }

    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('No authorization token was found'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    let canaction = false,
        post = null

    try {
      const user = await utils.getID(resToken)
      post = await Post.findOne({ _id: req.params.id })
      const towork = post._doc.owner
      canaction = await bauth.canAction(user, towork, 'update', 'post')
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    if(canaction) {
      try {
        await Post.findOneAndUpdate({ _id: post._id}, { $set: req.body }).select('-__v')
        res.send(200, 'updated post')
        next()
      } catch(err) {
        return next(new errors.ResourceNotFoundError('Post not found'))
      }
    }

    return next(new errors.ResourceNotFoundError('Post not found'))
  })

  server.del('/post/:id', async (req, res, next) => { // 204 req
    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('No authorization token was found'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    let canaction = false,
        post = null

    try {
      const user = await utils.getID(resToken)
      post = await Post.findOne({ _id: req.params.id })
      const towork = post._doc.owner
      canaction = await bauth.canAction(user, towork, 'delete', 'post')
    } catch(err) {
      return next(new errors.InternalError('db error testing'))
    }

    if(canaction) {
      try {
        await Post.deleteOne({ _id: req.params.id})
        res.send(204, 'deleted post')
        next()
      } catch(err) {
        return next(new errors.ResourceNotFoundError('Post not found'))
      }
    }

    return next(new errors.ResourceNotFoundError('Post not found'))
  })
}
