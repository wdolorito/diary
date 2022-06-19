import jwtutils from '../../../be/jwtutils'
import postutils from '../../../be/postutils'

export default async function handler(req, res) {
  const { method } = req

  if(method === 'POST') {
    const resToken = req.headers.authorization
    try {
      await jwtutils.isExpired(resToken)
    } catch(err) {
      return res.status(500).json({ response: 'Tricky trickster.  Send valid authorization. ' + err})
    }

    const reqType = req.headers['content-type']
    if(reqType !== 'application/json') {
      return res.status(400).json({ response: 'Set us up the JSON.' })
    }

    const { section, body } = req.body
    let { title, summary } = req.body


    if(title) {
      try {
        const post = postutils.createPost(title, summary, body)
        return res.status(201).send(post)
      } catch(err) {
        return res.status(400).json({ response: err })
      }
    }

    if(section) {
      try {
        const page = postutils.createStatic(section, body)
        return res.status(201).send(page)
      } catch(err) {
        return res.status(400).json({ response: err })
      }
    }
  }
  
  return res.status(405).json({ response: 'Get that mess outta here.' })
}
