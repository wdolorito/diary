import jwtutils from '../../../be/jwtutils'
import staticutils from '../../../be/staticutils'

const checkAuth = async (req, res, json = false) => {
  const resToken = req.headers.authorization
  try {
    await jwtutils.isExpired(resToken)
  } catch(err) {
    return res.status(401).json({ response: 'Tricky trickster.  Send valid authorization. ' + err})
  }

  if(json) return

  const reqType = req.headers['content-type']
  if(reqType !== 'application/json') {
    return res.status(400).json({ response: 'Set us up the JSON.' })
  }
}

export default async function handler(req, res) {
  const { method } = req
  const { section } = req.query

  if(method === 'POST') {
    await checkAuth(req, res)

    const { section, body } = req.body

    try {
      const page = staticutils.createStatic(section, body)
      return res.status(201).send(page)
    } catch(err) {
      return res.status(400).json({ response: err })
    }
  }

  if(method === 'GET') {
    try {
      const page = await staticutils.getStatic(section)
      if(page) {
        return res.status(200).send(page)
      } else {
        return res.status(204).end()
      }
    } catch(err) {
      return res.status(500).json({ response: err })
    }
}

  if(method === 'PUT') {
    await checkAuth(req, res)

    const { body } = req.body
    const set = {}
    set.body = body

    try {
      const result = await staticutils.updateStatic(section, set)
      if(result) return res.status(200).json({ response: section + ' updated.'})
    } catch(err) {
      return res.status(500).json({ response: err })
    }
  }

  if(method === 'DELETE') {
    await checkAuth(req, res, true)
    
    {
      try {
        const toDelete = await staticutils.deleteStatic(section)
        if(toDelete) return res.status(200).json({ response: section + ' deleted.'})
      } catch(err) {
        return res.status(500).json({ response: err })
      }
    }
  }

  return res.status(405).json({ response: 'Get that mess outta here.' })
}
