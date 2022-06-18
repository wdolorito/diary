import jwtutils from '../../../be/jwtutils'
import postutils from '../../../be/postutils'

export default async function handler(req, res) {
  const { method } = req
  const { hid } = req.query
  let titleHash, section
  if(hid.length > 1) {
    titleHash = hid[0]
    section = hid[1]
  }

  if(method === 'GET') {
    if(titleHash !== 'static') {
      const tosend = []

      let post = null
      try {
        post = await postutils.getPostByHash(hid)
      } catch(err) {
        return res.status(500).send(err)
      }

      if(post !== null) {
        tosend.push(post)
      } else {
        return res.status(500).json({ response: "You can't milk those!"})
      }

      try {
        const author = await postutils.getAuthor()
        tosend.splice(0, 0, author[0])
        if(author !== null) {
          return res.status(200).send(post)
        }
      } catch(err) {
        return res.status(500).send(err)
      }
    } else if(titleHash === 'static') {
      let page
      try {
        page = await postutils.getStatic(section)
      } catch(err) {
        return res.status(500).send(err)
      }

      if(page) {
        return res.status(200).send(page)
      } else {
        return res.status(500).json({ response: "You can't milk those!"})
      }
    }
  }

  if(method === 'PUT') {
    return res.status(200).json({ response: 'put ' + hid })
  }

  if(method === 'DELETE') {
    return res.status(200).json({ response: 'delete ' + hid })
  }

  return res.status(405).json({ response: 'Get that mess outta here.' })
}
