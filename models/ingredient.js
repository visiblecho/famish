import mongoose from 'mongoose'

const ingredientSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quanity: {
    type: Number,
    min: 1,
  },
  unitOfMeasurement: {
    type: String,
  },
  store: {
    // This could be extended to its own schema, incl. address (see Family model)
    type: String,
  },
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

export default Ingredient
