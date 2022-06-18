export default function handler(req, res) {
  const { method } = req

  if(method === 'GET') {
    return res.status(200).json({ response: 'get' })
  }

  if(method === 'PUT') {
    return res.status(200).json({ response: 'put' })
  }

  if(method === 'DELETE') {
    return res.status(200).json({ response: 'delete' })
  }

  return res.status(405).json({ response: 'Get that mess outta here.' })
}
