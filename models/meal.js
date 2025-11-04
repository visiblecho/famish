import mongoose from 'mongoose'

const mealSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  dish: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dish',
    required: true,
  },
  day: {
    type: Date,
    required: true,
  },
  timeOfDay: {
    type: String,
    enum: [
      'Breakfast',
      'Morning Snack',
      'Lunch',
      'Afternoon Snack',
      'Dinner',
      'Late Snack',
    ],
  },
})

const Meal = mongoose.model('Meal', mealSchema)

export default Meal
