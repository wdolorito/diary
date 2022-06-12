import mongoose from 'mongoose'
const timestamp = require('mongoose-timestamp')

const LoginSchema = new mongoose.Schema({
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

LoginSchema.plugin(timestamp)

export default mongoose.models.Login || mongoose.model('Login', LoginSchema)
