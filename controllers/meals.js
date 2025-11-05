import express from 'express'
import isSignedIn from '../middleware/is-signed-in.js'
import Dish from '../models/dish.js'
import Meal from '../models/meal.js'

const router = express.Router()

// * Routes

// * Index GET /
router.get('/', isSignedIn, async (req, res) => {
  const familyId = req.session.user.family

  // Get meals from the database
  const familyMeals = await Meal.find().populate([
    {
      path: 'owner',
      match: { family: familyId }, // only where owner.family matches user.familyID
    },
    {
      path: 'dish',
    },
  ])

  // Remove dishes where owner is null (because match didn't pass)
  const filteredMeals = familyMeals.filter((meal) => meal.owner)

  // TODO only pass future meals to view (perhaps already filter in .popuate())
  res.render('meals/index', { meals: filteredMeals })
})

// * New GET /new
router.get('/new', isSignedIn, async (req, res) => {
  const familyId = req.session.user.family

  // Get dishes from the database
  const familyDishes = await Dish.find().populate({
    path: 'owner',
    match: { family: familyId }, // only where owner.family matches user.familyID
  })

  // Remove dishes where owner is null (because match didn't pass)
  const filteredDishes = familyDishes.filter((dish) => dish.owner)

  res.render('meals/new', { dishes: filteredDishes })
})

// * Create POST /
router.post('/', isSignedIn, async (req, res) => {
  // Expects req.body to have .date, .timeOfDay and .dish
  req.body.owner = req.session.user._id

  // Create the meal in the database
  const createdMeal = await Meal.create(req.body)

  // Schedule a success message and redirect to the index page
  req.session.message = {
    class: 'success',
    text: `Meal added`,
  }
  res.redirect('/meals')
})

// * Edit GET /:id/edit
router.get('/:id', isSignedIn, (req, res) => res.render('meals/manage'))

// * Update PUT /:id
router.put('/:id', isSignedIn, (req, res) => {
  res.send('Put', req.body)
})

// * Delete DELETE /:id
router.delete('/:id', isSignedIn, (req, res) => {
  res.send('Delete', req.body)
})

export default router
