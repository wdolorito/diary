import mongoose from 'mongoose'

const StaticSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  }
},
{ timestamps: true })

export default mongoose.models.Static || mongoose.model('Static', StaticSchema, 'Static')
