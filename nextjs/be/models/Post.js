import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  friendlyURL: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  titleHash: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  }
},
{ timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', PostSchema, 'Post')
