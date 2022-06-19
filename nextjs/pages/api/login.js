import bauth from '../../be/bauth'
import jwtutils from '../../be/jwtutils'

export default async function handler(req, res) {
  const { method } = req

  if(method === 'POST') {
    const reqType = req.headers['content-type']
    if(reqType !== 'application/json') {
      return res.status(400).json({ response: 'Set us up the JSON.' })
    }

    const { email, password } = req.body

    let user

    try {
      user = (await bauth(email, password)).email
    } catch(err) {
      return res.status(401).json({ response: 'Stop hacking. ' + err })
    }

    const token = jwtutils.genToken({ email: user })

    try {
      const refresh = await jwtutils.genRefresh()
      return res.status(200).send({ token, refresh })
    } catch(err) {
      return res.status(500).json({ response: 'Refresh broke. ' + err })
    }
  }
  
  return res.status(405).json({ response: 'Get that mess outta here.' })
}
