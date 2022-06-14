import mongoose from 'mongoose'
const expireTime = 604800 // (stored in seconds) Set to max time of refresh token (1 week, 86400 minutes)

const TokenWhitelistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    select: false,
    trim: true
  }
},
{ timestamps: true })

TokenWhitelistSchema.index({ createdAt: 1 }, { expireAfterSeconds: expireTime })

export default mongoose.models.TokenWhitelist || mongoose.model('TokenWhitelist', TokenWhitelistSchema, 'TokenWhitelist')
