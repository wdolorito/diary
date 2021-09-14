require('dotenv').config()
const port = process.env.PORT || 5000
const restify = require('restify')
const mongoose = require('mongoose')
const rjwt = require('restify-jwt-community')
const corsMiddleware = require('restify-cors-middleware2')

const server = restify.createServer()

server.use(restify.plugins.bodyParser())

const unprotected = [ '/login', '/posts', '/refresh', '/ends', { url: /^\/post\/.*/, methods: ['GET']  } ]
server.use(rjwt({ secret: process.env.APP_SECRET }).unless({ path: unprotected }))

const cors = corsMiddleware({
  origins: [
    'http://localhost:3000',
    'http://192.168.15.*'
  ],
  allowHeaders: [ 'Authorization' ]
})
server.pre(cors.preflight)
server.pre(cors.actual)

server.pre(restify.plugins.pre.userAgentConnection())
server.pre(restify.plugins.pre.dedupeSlashes())

server.use(restify.plugins.throttle({
  burst:120,
  rate:60,
  ip:true
}))

server.listen(port, () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

const db = mongoose.connection

db.on('error', err => console.log(err))

db.once('open', () => {
  require('./routes/authenticate')(server)
  require('./routes/endpoints')(server)
  require('./routes/posts')(server)
  console.log('Listening on port: %s', port)
})
