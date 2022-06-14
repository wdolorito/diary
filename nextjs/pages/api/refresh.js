import jwtutils from '../../be/jwtutils'

export default async function handler(req, res) {
  const { method } = req

  if(method === 'POST') {
    const reqType = req.headers['content-type']
    if(reqType !== 'application/json') {
      return res.status(400).json({ response: 'Set us up the JSON.' })
    }

    const { token } = req.body
    try {
      await jwtutils.tokenIsExpired(token)
    } catch(err) {
      return res.status(500).json({ response: 'That token is way too old.' })
    }
    
    try {
      await jwtutils.removeToken(token)
    } catch(err) {
      return res.status(500).json({ response: 'Stop being tricky. ' + err })
    }

    let email,
        refresh

    try {
      email = await jwtutils.getUser()
    } catch(err) {
      return res.status(500).json({ response: err })
    }

    const newjwt = jwtutils.genToken({ email })

    try {
      refresh = await jwtutils.genRefresh()
    } catch(err) {
      return res.status(500).json({ response: 'Refresh broke. ' + err })
    }

    return res.status(200).send({ token: newjwt, refresh })
  } else {
    return res.status(405).json({ response: 'Get that mess outta here.' })
  }
}
