const crypto = require('crypto')
import dbConnect from './dbConnect'
import Owner from './models/Owner'
import Post from './models/Post'
import Static from './models/Static'

const getAuthor = () => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const author = await Owner.find()
                                .select('-_id')
                                .select('-owner')
                                .select('-updatedAt')
                                .select('-__v')
                                .sort({ "createdAt": 1 })
      res(author)
    } catch(err) {
      rej('author lookup failed')
    }
  }
)}

const getAuthorId = () => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const author = await Owner.find()
                                .sort({ "createdAt": 1 })
      res(author[0]._id)
    } catch(err) {
      rej(new errors.InternalError('authorId lookup failed'))
    }
})
}

const getFriendlyURL = title => {
  const friendlyURL = title.toLowerCase()
                           .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                           .replace(/\s+/g, '-')

   return friendlyURL
}

const getTitleHash = title => {
  return crypto.createHash('sha1').update(title).digest('hex')
}

const createPost = (title, summary, body) => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    if(title.length > 90) title = title.substring(0, 90).trim()
    const friendlyURL = createFriendlyURL(title)
    const titleHash = createTitleHash(friendlyURL)

    let sum = summary

    if(summary === undefined) {
      sum = body.substring(0, 140).trim()
    } else {
      sum = summary.substring(0, 140).trim()
    }

    if(sum.length >= 139) summary += ' ...'

    let author

    try {
      author = await getAuthorForPost()
    } catch(err) {
      rej('The author has left the building.')
    }

    const post = new Post({
      owner: author,
      title,
      friendlyURL,
      titleHash,
      summary: sum,
      body
    })

    try {
      await post.save()
      res(friendlyURL + ' saved')
    } catch(err) {
      rej('unable to post')
    }
  })
}

const createStatic = (section, body) => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    const page = new Static({
      section,
      body
    })
  
    try {
      await page.save()
      res(section + ' saved')
    } catch(err) {
      rej('unable to post')
    }
  })
}

const getPost = titleHash => {
  return new Promise(async (res, rej) => {
    try {
      await dbConnect()

      const result = await Post.findOne({ titleHash })
                                .select('-__v')
                                .select('-owner')
      res(result)
    } catch(err) {
      rej(titleHash + ' find failed')
    }
  })
}

const getStatic = section => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const result = await Static.findOne({ section })
                                  .select('-_id')
                                  .select('-__v')
      res(result)
    } catch(err) {
      rej(err)
    }
  })
}

const updatePost = (_id, set) => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      await Post.findOneAndUpdate({ _id }, { $set: set })
      res(true)
    } catch(err) {
      rej('Unable to update post ' + _id)
    }
  })
}

const updateStatic = (section, set) => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      await Static.findOneAndUpdate({ section }, { $set: set })
      res(true)
    } catch(err) {
      rej('Unable to update ' + section + ' section')
    }
  })
}

const deletePost = _id => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      await Post.findOneAndDelete({ _id })
      res(true)
    } catch(err) {
      rej('Unable to delete post ' + _id)
    }
  })
}

const postutils = {
                   getAuthor,
                   getAuthorId,
                   getFriendlyURL,
                   getTitleHash,
                   createPost,
                   createStatic,
                   getPost,
                   getStatic,
                   updatePost,
                   updateStatic,
                   deletePost
                  }

export default postutils
