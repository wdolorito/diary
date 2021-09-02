const errors = require('restify-errors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Owner = require('../models/Owner')
const Post = require('../models/Post')
const Static = require('../models/Static')
const bauth = require('../utility/bauth')
const utils = require('../utility/jwtutils')
const Cache = require('../utility/cache.service')

const ttl = 60 * 5 // 5 minutes (in seconds)
const getCache = new Cache(ttl)

const getAuthor = () => {
  return new Promise(async (res, rej) => {
    try {
      res(await Owner.find().select('-_id').select('-owner').select('-updatedAt').select('-__v').sort({ "createdAt": 1 }))
    } catch(err) {
      rej(err)
    }
  })
}

const getAuthorForPost = () => {
  return new Promise(async (res, rej) => {
    try {
      res(await Owner.find().sort({ "createdAt": 1 }))
    } catch(err) {
      rej(err)
    }
  })
}

const createFriendlyURL = (title) => {
  const friendlyURL = title.toLowerCase()
                           .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                           .replace(/\s+/g, '-')

   return friendlyURL
}

const createTitleHash = (title) => {
  return crypto.createHash('sha1').update(title).digest('hex')
}

module.exports = server => {
  Post.init()
  Static.init()

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

    const { section, title, body } = req.body
    let { summary } = req.body

    if(title) {
      const friendlyURL = createFriendlyURL(title)
      const titleHash = createTitleHash(friendlyURL)

      if(summary === undefined) {
        summary = body.substring(0, 140).trim()
      }

      if(summary.length >= 139) {
        summary = summary.substring(0, 139).trim()
        summary += ' ...'
      }

      let author

      try {
        author = await getAuthorForPost()
      } catch(err) {
        return next(new errors.InternalError('db error'))
      }

      const post = new Post({
        owner: author[0]._id,
        title,
        friendlyURL,
        titleHash,
        summary,
        body
      })

      try {
        await post.save()
        res.send(201, 'saved post')
        next()
      } catch(err) {
        return next(new errors.InternalError('unable to post'))
      }
    }

    if(section) {
      const static = new Static({
        section,
        body
      })

      try {
        await static.save()
        res.send(201, section + ' saved')
        next()
      } catch(err) {
        return next(new errors.InternalError('unable to post'))
      }
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
      const posts = await Post.find().select('-__v').select('-owner').sort({ "updatedAt": -1 })
      const length = posts.length
      for(count = 0; count < length; count++) {
        tosend.push(posts[count])
      }

      res.send(200, tosend)
      next()
    } catch(err) {
      return next(new errors.InvalidContentError(err))
    }

    return next(new errors.ResourceNotFoundError('unable to retrieve results'))
  })

  server.get('/post/:hash', async (req, res, next) => {
    const titleHash = req.params.hash || null

    if(titleHash !== null && titleHash !== 'static') {
      const tosend = []

      let post = null
      try {
        post = await Post.findOne({ titleHash }).select('-__v').select('-owner')
      } catch(err) {
        return next(new errors.ResourceNotFoundError( titleHash + ' not found'))
      }

      if(post !== null) {
        tosend.push(post)
      } else {
        return next(new errors.ResourceNotFoundError( titleHash + ' not found'))
      }

      try {
        const author = await getAuthor()
        tosend.splice(0, 0, author[0])
        if(author !== null) {
          res.send(200, tosend)
          next()
        }
      } catch(err) {
        return next(new errors.InvalidContentError(err))
      }
    } else if(titleHash === 'static') {
      const section = req.getQuery()

      let page = null
      try {
        page = await Static.findOne({ section }).select('-__v')
      } catch(err) {
        return next(new errors.ResourceNotFoundError( 'Static page ' + section + ' not found'))
      }

      if(page !== null) {
        res.send(200, page)
        next()
      } else {
        return next(new errors.ResourceNotFoundError( 'Static page ' + section + ' not found'))
      }
    }

    return next(new errors.ResourceNotFoundError('Need Post hash'))
  })

  server.post('/flush', async (req, res, next) => {
    const resToken = req.headers.authorization
    try {
      if(await utils.isExpired(resToken)) {
        return next(new errors.InvalidCredentialsError('The token has expired'))
      }
    } catch(err) {
      return next(new errors.InternalError('db error'))
    }

    try {
      getCache.flush()
      res.send(204)
      next()
    } catch(err) {
      console.log(err)
      console.log(typeof(getCache))
      console.log(getCache)
      return next(new errors.InternalError('cache error'))
    }
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
      let { section, title, body, summary } = req.body

      const set = {}

      if(title) {
        set.title = title
        set.friendlyURL = createFriendlyURL(title)
        set.titleHash = createTitleHash(set.friendlyURL)

        if(body) set.body = body

        if(body !== undefined && summary === undefined) summary = body.substring(0, 140).trim()

        if(summary) {
          summary = summary.substring(0, 140).trim()
          if(summary.length >= 139) summary = summary + ' ...'
          set.summary = summary
        }

        try {
          await Post.findOneAndUpdate({ _id: id }, { $set: set })
          res.send(200, 'updated post')
          next()
        } catch(err) {
          return next(new errors.InternalError('Unable to update Post ' + id))
        }
      }

      if(section) {
        set.section = section
        set.body = body

        try {
          await Static.findOneAndUpdate({ section }, { $set: set })
          res.send(200, 'updated section')
          next()
        } catch(err) {
          return next(new errors.InternalError('Unable to update Section ' + section))
        }
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
