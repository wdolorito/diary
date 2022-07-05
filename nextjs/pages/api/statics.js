import staticutils from '../../be/staticutils'

export default async function handler(req, res) {
  const { method } = req
  if(method === 'GET') {
    let statics
    try {
      statics = await staticutils.getStatics()
    } catch(err) {
      return res.status(500).json({ response: err })
    }

    const length = statics.length
    if(length > 0) {
      return res.status(200).send(statics)
    } else {
      return res.status(204).end()
    }
  }

  return res.status(405).json({ response: 'Get that mess outta here.' })
}
