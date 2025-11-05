import express from 'express'
import isSignedIn from '../middleware/is-signed-in.js'
import Dish from '../models/dish.js'
import Meal from '../models/meal.js'

const router = express.Router()

// * Index GET /
router.get('/', isSignedIn, async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error showing meals:<br>${error.message}`,
    }
    res.redirect('/')
  }
})

// * New GET /new
router.get('/new', isSignedIn, async (req, res) => {
  try {
    const familyId = req.session.user.family

    // Get dishes from the database
    const familyDishes = await Dish.find().populate({
      path: 'owner',
      match: { family: familyId }, // only where owner.family matches user.familyID
    })

    // Remove dishes where owner is null (because match didn't pass)
    const filteredDishes = familyDishes.filter((dish) => dish.owner)

    // If there are no dishes, redirect to creating a dish
    if (filteredDishes.length <= 0) {
      req.session.message = {
        class: 'info',
        text: `Add dishes before adding meals`,
      }
      return res.redirect('/dishes')
    }

    res.render('meals/new', { dishes: filteredDishes })
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error adding meal:<br>${error.message}`,
    }
    res.redirect('/meals')
  }
})

// * Create POST /
router.post('/', isSignedIn, async (req, res) => {
  try {
    // Expects req.body to have .date, .timeOfDay and .dish.
    req.body.owner = req.session.user._id

    // Create the meal in the database.
    await Meal.create(req.body)

    // Schedule a success message and redirect to the index page.
    req.session.message = { class: 'success', text: `Meal added` }
    res.redirect('/meals')
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error adding meal:<br>${error.message}`,
    }
    res.redirect('/meals')
  }
})

// * Edit GET /:id/edit
router.get('/:id', isSignedIn, (req, res) => res.render('meals/manage'))

// * Update PUT /:id
router.put('/:id', isSignedIn, (req, res) => {
  try {
    // Schedule a success message and redirect to the index page
    req.session.message = { class: 'success', text: `Meal updated` }
    res.send('Put', req.body)
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error removing meal:<br>${error.message}`,
    }
    res.redirect('/meals')
  }
})

// * Delete DELETE /:id
router.delete('/:id', isSignedIn, (req, res) => {
  try {
    // Schedule a success message and redirect to the index page
    req.session.message = { class: 'success', text: `Meal removed` }
    res.send('Delete', req.body)
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error removing meal:<br>${error.message}`,
    }
    res.redirect('/meals')
  }
})

export default router
