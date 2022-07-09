import jwtutils from '../../../be/jwtutils'
import postutils from '../../../be/postutils'

export default async function handler(req, res) {
  const { method } = req
  const { titleHash } = req.query

  if(method === 'POST') {
    await jwtutils.checkAuth(req, res)

    const { body } = req.body
    let { title, summary } = req.body

    if(title) {
      try {
        const post = postutils.createPost(title, summary, body)
        return res.status(201).send(post)
      } catch(err) {
        return res.status(400).json({ response: err })
      }
    }
  }

  if(method === 'GET') {
    const tosend = []

    let post = null
    try {
      post = await postutils.getPost(titleHash[0])
    } catch(err) {
      return res.status(500).send(err)
    }

    if(post) {
      tosend.push(post)
    } else {
      return res.status(500).json({ response: "You can't milk those!"})
    }

    try {
      const author = await postutils.getAuthor()
      tosend.splice(0, 0, author[0])
      if(author) return res.status(200).send(tosend)
    } catch(err) {
      return res.status(500).json({ response: err })
    }
  }

  if(method === 'PUT') {
    await jwtutils.checkAuth(req, res)

    let { title, body, summary } = req.body
    const set = {}
    if(body) set.body = body

    if(title) {
      set.title = title
      set.friendlyURL = postutils.getFriendlyURL(title)
      set.titleHash = postutils.getTitleHash(set.friendlyURL)

      if(body !== undefined && summary === undefined) summary = body.substring(0, 140).trim()

      if(summary) {
        summary = summary.substring(0, 140).trim()
        if(summary.length >= 139) summary += ' ...'
        set.summary = summary
      }

      try {
        const result = await postutils.updatePost(titleHash[0], set)
        if(result) return res.status(200).json({ response: titleHash + ' updated.'})
      } catch(err) {
        return res.status(500).json({ response: err })
      }
    }
  }

  if(method === 'DELETE') {
    await jwtutils.checkAuth(req, res, false)

    try {
      const toDelete = await postutils.deletePost(titleHash)
      if(toDelete) return res.status(200).json({ response: titleHash + ' deleted.'})
    } catch(err) {
      return res.status(500).json({ response: err })
    }
  }

  return res.status(405).json({ response: 'Get that mess outta here.' })
}
