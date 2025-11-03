import mongoose from 'mongoose'

const familySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String, // This could be extended to its own schema
  },
})

const Family = mongoose.model('Family', familySchema)

export default Family
