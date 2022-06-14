import mongoose from 'mongoose'
const expireTime = 600 // (stored in seconds) Set to max time of jwt (10 minutes)

const BlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    select: false,
    trim: true
  }
},
{ timestamps: true })

BlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: expireTime })

export default mongoose.models.Blacklist || mongoose.model('Blacklist', BlacklistSchema, 'Blacklist')
