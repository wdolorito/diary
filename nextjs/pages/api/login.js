import dbConnect from '../../be/dbConnect'
import Login from '../../be/models/Login'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  if(method === 'POST') {
    res.status(200).json({ name: 'login' })
  } else {
    res.status(400).json({ response: 'Unsupported method.' })
  }
}
