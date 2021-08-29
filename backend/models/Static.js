const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

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
})

StaticSchema.plugin(timestamp)

const Static = mongoose.model('Static', StaticSchema, 'Static')
module.exports = Static
