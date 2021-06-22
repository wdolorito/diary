const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const expireTime = 1800 // Set to max time of jwt (def 30 minutes)

const BlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    select: false,
    trim: true
  }
})

BlacklistSchema.plugin(timestamp)
BlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: expireTime })

const Blacklist = mongoose.model('Blacklist', BlacklistSchema, 'Blacklist')
module.exports = Blacklist
