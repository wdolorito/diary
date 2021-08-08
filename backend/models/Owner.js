const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const OwnerSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
    trim: true,
    immutable: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  avatar: {
    type: String,
    required: false,
    trim: true
  }
})

OwnerSchema.plugin(timestamp)

const Owner = mongoose.model('Owner', OwnerSchema, 'Owner')
module.exports = Owner
