import jwtutils from '../../../be/jwtutils'
import postutils from '../../../be/postutils'

export default async function handler(req, res) {
  const { method } = req
  const { hid } = req.query
  console.log(method)

  if(method === 'GET') {
    let titleHash = hid, section
    if(hid.length > 1) {
      titleHash = hid[0]
      section = hid[1]
    }

    if(titleHash !== 'static') {
      const tosend = []

      let post = null
      try {
        post = await postutils.getPost(hid)
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
    
    if(titleHash === 'static') {
      try {
        const page = await postutils.getStatic(section)
        if(page) {
          return res.status(200).send(page)
        } else {
          return res.status(204).end()
        }
      } catch(err) {
        return res.status(500).json({ response: err })
      }
    }
  }

  if(method === 'PUT') {
    const resToken = req.headers.authorization
    try {
      await jwtutils.isExpired(resToken)
    } catch(err) {
      return res.status(401).json({ response: 'Tricky trickster.  Send valid authorization. ' + err})
    }

    const reqType = req.headers['content-type']
    if(reqType !== 'application/json') {
      return res.status(400).json({ response: 'Set us up the JSON.' })
    }

    let id = hid, section
    if(hid.length > 1) {
      id = hid[0]
      section = hid[1]
    }
    console.log('id', id, 'section', section)

    let { title, body, summary } = req.body
    const set = {}
    if(body) set.body = body

    if(id !== 'static') {
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
          const result = await postutils.updatePost(id, set)
          if(result) return res.status(200).json({ response: id + ' updated.'})
        } catch(err) {
          return res.status(500).json({ response: err })
        }
      }
    }
    
    if(id === 'static') {
      try {
        const result = await postutils.updateStatic(section, set)
        if(result) return res.status(200).json({ response: section + ' updated.'})
      } catch(err) {
        return res.status(500).json({ response: err })
      }
    }
  }

  if(method === 'DELETE') {
    const resToken = req.headers.authorization
    try {
      await jwtutils.isExpired(resToken)
    } catch(err) {
      return res.status(401).json({ response: 'Tricky trickster.  Send valid authorization. ' + err})
    }

    try {
      const toDelete = await postutils.deletePost(hid)
      if(toDelete) return res.status(200).json({ response: hid + ' deleted.'})
    } catch(err) {
      return res.status(500).json({ response: err })
    }
  }

  return res.status(405).json({ response: 'Get that mess outta here.' })
}
