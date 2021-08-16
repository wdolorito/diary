const errors = require('restify-errors')
const jwt = require('jsonwebtoken')
const Owner = require('../models/Owner')
const Post = require('../models/Post')
const bauth = require('../utility/bauth')
const utils = require('../utility/jwtutils')

const getAuthor = () => {
  return new Promise(async (res, rej) => {
    try {
      // const author = await Owner.findOne({ createdAt: -1 })
      res(await Owner.find({}).sort({ "createdAt": -1 }))
    } catch(err) {
      rej(err)
    }
  })
}

module.exports = server => {
  Post.init()

  // CRUD operations -> post get put del
  server.post('/post', async (req, res, next) => {
    try {
      const author = await getAuthor()
      console.log(author)
      res.send(author)
      next()
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }
    // const resToken = req.headers.authorization
    // try {
    //   if(await utils.isExpired(resToken)) {
    //     return next(new errors.InvalidCredentialsError('No authorization token was found'))
    //   }
    // } catch(err) {
    //   return next(new errors.InternalError('db error'))
    // }
    //
    // if(!req.is('application/json')) {
    //   return next(new errors.InvalidContentError('Data not sent correctly'))
    // }
    //
    // const { title, body } = req.body
    // const post = new Post({
    //   owner: user,
    //   title,
    //   body
    // })
    //
    // try {
    //   const newPost = await post.save()
    //   res.send(201, 'saved post')
    //   next()
    // } catch(err) {
    //   return next(new errors.InternalError('db error'))
    // }
    //
    // return next(new errors.InternalError('unable to post'))
  })

  server.get('/posts', async (req, res, next) => {
    const tosend = []
    try {
      const owner = await Owner.find().sort({ createdAt: -1 })
                                      .select('-_id')
                                      .select('-owner')
                                      .select('-updatedAt')
                                      .select('-createdAt')
                                      .select('-__v')
      tosend.push(owner[0])
    } catch(err) {
      return next(new errors.InvalidContentError(err))
    }

    try {
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
    const id = req.params.id
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('No authorization token was found'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    try {
      await Post.findOneAndUpdate({ _id: id}, { $set: req.body })
      res.send(200, 'updated post')
      next()
    } catch(err) {
      return next(new errors.ResourceNotFoundError('Unable to update Post ' + id))
    }

    return next(new errors.ResourceNotFoundError('Unable to update Post ' + id))
  })

  server.del('/post/:id', async (req, res, next) => { // 204 req
    const resToken = req.headers.authorization
    const id = req.params.id
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('No authorization token was found'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    try {
      await Post.deleteOne({ _id: id })
      res.send(204, 'deleted post')
      next()
    } catch(err) {
      return next(new errors.ResourceNotFoundError('Unable to delete Post ' + id))
    }

    return next(new errors.ResourceNotFoundError('Unable to delete Post ' + id))
  })
}
