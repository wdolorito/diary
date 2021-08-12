const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const expireTime = 604800 // (stored in seconds) Set to max time of jwt (1 week, 86400 minutes)

const TokenWhitelistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    select: false,
    trim: true
  }
})

TokenWhitelistSchema.plugin(timestamp)
TokenWhitelistSchema.index({ createdAt: 1 }, { expireAfterSeconds: expireTime })

const TokenWhitelist = mongoose.model('TokenWhitelist', TokenWhitelistSchema, 'TokenWhitelist')
module.exports = TokenWhitelist
