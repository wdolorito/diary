const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const UserSchema = new mongoose.Schema({
  isMaster: {
    type: Boolean,
    default: false,
    select: false,
    immutable: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    select: false,
    required: true
  }
})

UserSchema.plugin(timestamp)

const User = mongoose.model('User', UserSchema, 'User')
module.exports = User
