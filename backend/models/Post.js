const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

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
})

PostSchema.plugin(timestamp)

const Post = mongoose.model('Post', PostSchema, 'Post')
module.exports = Post
