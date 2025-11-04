import mongoose from 'mongoose'

const dishSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  minutes: {
    type: Number,
    min: 1,
  },
  recipe: {
    // This should include a validator so that only proper URLs are stored
    type: String,
  },
  ingredients: {
    type: String,
  },
  /*
  ingredients: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Ingredient',
  },
  likedBy: {
    type: [mongoose.Schema.ObjectId],
    ref: 'User',
  },
  */
})

const Dish = mongoose.model('Dish', dishSchema)

export default Dish
