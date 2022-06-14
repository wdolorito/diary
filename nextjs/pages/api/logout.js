import bauth from '../../be/bauth'
import jwtutils from '../../be/jwtutils'

export default async function handler(req, res) {
  const { method } = req

  if(method === 'POST') {
    const reqType = req.headers['content-type']
    if(reqType !== 'application/json') {
      return res.status(400).json({ response: 'Set us up the JSON.' })
    }

    const resJwt = req.headers.authorization
    const { token } = req.body
    
    try {
      await jwtutils.blacklistJwt(resJwt)
    } catch(err) {
      console.log(err)
    }

    try {
      await jwtutils.removeToken(token)
    } catch(err) {
      return res.status(500).json({ response: 'Stop being tricky. ' + err })
    }
    
    return res.status(200).send({ response: 'logged out' })
  } else {
    return res.status(405).json({ response: 'Get that mess outta here.' })
  }
}
