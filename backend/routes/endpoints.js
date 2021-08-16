const errors = require('restify-errors')

module.exports = server => {
  server.get('/ends', async (req, res, next) => {

    let docs  = '{'
        docs += '   "routes": ['
        docs += '     {'
        docs += '        "route": "/post",'
        docs += '        "type": "post",'
        docs += '        "description": "Create new Post",'
        docs += '        "response": "201"'
        docs += '     },'
        docs += '     {'
        docs += '        "route": "/posts",'
        docs += '        "type": "get",'
        docs += '        "description": "Get all Posts",'
        docs += '        "response": "200/JSON"'
        docs += '     },'
        docs += '     {'
        docs += '        "route": "/post/:id",'
        docs += '        "type": "get",'
        docs += '        "description": "Get Post with ID",'
        docs += '        "response": "200/JSON"'
        docs += '     },'
        docs += '     {'
        docs += '        "route": "/post/:id",'
        docs += '        "type": "put",'
        docs += '        "description": "Update Post",'
        docs += '        "response": "200"'
        docs += '     },'
        docs += '     {'
        docs += '        "route": "/post/:id",'
        docs += '        "type": "del",'
        docs += '        "description": "Delete Post",'
        docs += '        "response": "204"'
        docs += '     },'
        docs += '     {'
        docs += '        "route": "/login",'
        docs += '        "type": "post",'
        docs += '        "description": "Log in User",'
        docs += '        "response": "200/JSON"'
        docs += '     },'
        docs += '     {'
        docs += '        "route": "/logout",'
        docs += '        "type": "post",'
        docs += '        "description": "Log out User",'
        docs += '        "response": "200"'
        docs += '     }'
        docs += ']}'

    const tosend = JSON.parse(docs)

    res.send(tosend)
    next()
  })
}
