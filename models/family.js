import mongoose from 'mongoose'
import { randomUUID } from 'crypto'

const familySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    // This could be extended to its own schema
    type: String,
  },
  familycode: {
    type: mongoose.Schema.Types.UUID,
    default: () => randomUUID(),
    required: true,
  },
})

const Family = mongoose.model('Family', familySchema)

export default Family
