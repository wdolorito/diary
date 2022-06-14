import mongoose from 'mongoose'

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
},
{ timestamps: true })

export default mongoose.models.Login || mongoose.model('Login', LoginSchema, 'Login')
