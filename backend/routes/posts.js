const errors = require('restify-errors')
const jwt = require('jsonwebtoken')
const Owner = require('../models/Owner')
const Post = require('../models/Post')
const bauth = require('../utility/bauth')
const utils = require('../utility/jwtutils')

const getAuthor = () => {
  return new Promise(async (res, rej) => {
    try {
      res(await Owner.find().select('-_id').select('-owner').select('-__v').sort({ "createdAt": -1 }))
    } catch(err) {
      rej(err)
    }
  })
}

const getAuthorForPost = () => {
  return new Promise(async (res, rej) => {
    try {
      res(await Owner.find().sort({ "createdAt": -1 }))
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
        return next(new errors.InvalidCredentialsError('The token has expired'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError('Data not sent correctly'))
    }

    const { title, body } = req.body

    let author

    try {
      author = await getAuthorForPost()
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    const post = new Post({
      owner: author[0]._id,
      title,
      body
    })

    try {
      await post.save()
      res.send(201, 'saved post')
      next()
    } catch(err) {
      return next(new errors.InternalError('unable to post'))
    }

    return next(new errors.InternalError('unable to post'))
  })

  server.get('/posts', async (req, res, next) => {
    const tosend = []
    try {
      const author = await getAuthor()
      tosend.push(author[0])
    } catch(err) {
      return next(new errors.InvalidContentError(err))
    }

    try {
      const posts = await Post.find().select('-__v').select('-owner')
      const length = posts.length
      for(count = 0; count < length; count++) {
        tosend.push(posts[count])
      }

      res.send(tosend)
      next()
    } catch(err) {
      return next(new errors.InvalidContentError(err))
    }
  })

  server.get('/post/:id', async (req, res, next) => {
    const tosend = []
    try {
      const author = await getAuthor()
      tosend.push(author[0])
    } catch(err) {
      return next(new errors.InvalidContentError(err))
    }

    const id = req.params.id || null

    if(id !== null) {
      try {
        tosend.push(await Post.findOne({ _id: req.params.id }).select('-__v').select('-owner'))
        res.send(tosend)
        next()
      } catch(err) {
        return next(new errors.ResourceNotFoundError('Post ' + id + ' not found'))
      }
    }

    return next(new errors.ResourceNotFoundError('Need Post ID'))
  })

  server.put('/post/:id', async (req, res, next) => { // 200 req
    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError('Data not sent correctly'))
    }

    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('The token has expired'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    const id = req.params.id || null

    if(id !== null) {
      try {
        await Post.findOneAndUpdate({ _id: id}, { $set: req.body })
        res.send(200, 'updated post')
        next()
      } catch(err) {
        return next(new errors.ResourceNotFoundError('Unable to update Post ' + id))
      }
    }

    return next(new errors.ResourceNotFoundError('Need Post ID to update'))
  })

  server.del('/post/:id', async (req, res, next) => { // 204 req
    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('The token has expired'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    const id = req.params.id || null
    if(id !== null) {
      try {
        await Post.deleteOne({ _id: id })
        res.send(204, 'deleted post')
        next()
      } catch(err) {
        return next(new errors.ResourceNotFoundError('Unable to delete Post ' + id))
      }
    }

    return next(new errors.ResourceNotFoundError('Need Post ID to delete'))
  })
}
