import postutils from '../../be/postutils'

export default async function handler(req, res) {
  const { method } = req
  if(method === 'GET') {
    const tosend = []

    let posts
    try {
      posts = await postutils.getPosts()
    } catch(err) {
      return res.status(500).json({ response: err })
    }

    const length = posts.length
    if(length > 0) {
      for(let count = 0; count < length; count++) {
        tosend.push(posts[count])
      }

      try {
        const author = await postutils.getAuthor()
        tosend.splice(0, 0, author[0])
        return res.status(200).send(tosend)
      } catch(err) {
        return res.status(500).json({ response: err })
      }
    } else {
      return res.status(204).end()
    }
  }

  return res.status(405).json({ response: 'Get that mess outta here.' })
}
