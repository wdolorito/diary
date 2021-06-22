require('dotenv').config()
const port = process.env.PORT || 5000
const restify = require('restify')
const mongoose = require('mongoose')
const rjwt = require('restify-jwt-community')
const corsMiddleware = require('restify-cors-middleware')

const server = restify.createServer()

server.use(restify.plugins.bodyParser())

const unprotected = [ '/login', '/posts', '/register', '/ends' ]
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

server.listen(port, () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
})

const db = mongoose.connection

db.on('error', err => console.log(err))

db.once('open', () => {
  require('./routes/endpoints')(server)
  require('./routes/posts')(server)
  require('./routes/users')(server)
  console.log('Listening on port: %s', port)
})
