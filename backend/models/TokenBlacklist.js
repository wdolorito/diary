const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const expireTime = 604800 // (stored in seconds) Set to max time of jwt (1 week, 86400 minutes)

const TokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    select: false,
    trim: true
  }
})

TokenBlacklistSchema.plugin(timestamp)
TokenBlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: expireTime })

const TokenBlacklist = mongoose.model('TokenBlacklist', TokenBlacklistSchema, 'TokenBlacklist')
module.exports = TokenBlacklist
