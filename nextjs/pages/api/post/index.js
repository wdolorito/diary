import jwtutils from '../../../be/jwtutils'
import postutils from '../../../be/postutils'
import staticutils from '../../../be/staticutils'

export default async function handler(req, res) {
  const { method } = req

  if(method === 'POST') {
    await jwtutils.checkAuth(req, res)

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
        const page = staticutils.createStatic(section, body)
        return res.status(201).send(page)
      } catch(err) {
        return res.status(400).json({ response: err })
      }
    }
  }
  
  return res.status(405).json({ response: 'Get that mess outta here.' })
}
