import mongoose from 'mongoose'

const OwnerSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  handle: {
    type: String,
    required: true,
    trim: true
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
},
{ timestamps: true })

export default mongoose.models.Owner || mongoose.model('Owner', OwnerSchema, 'Owner')
