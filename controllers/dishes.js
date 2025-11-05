import express from 'express'
import isSignedIn from '../middleware/is-signed-in.js'
import Dish from '../models/dish.js'
import Meal from '../models/meal.js'

const router = express.Router()

// * Index GET /
router.get('/', isSignedIn, async (req, res) => {
  try {
    const familyId = req.session.user.family

    // Get dishes from the database
    const familyDishes = await Dish.find().populate({
      path: 'owner',
      match: { family: familyId }, // only where owner.family matches user.familyID
    })

    // Remove dishes where owner is null (because match didn't pass)
    const filteredDishes = familyDishes.filter((dish) => dish.owner)

    res.render('dishes/index', { dishes: filteredDishes })
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error showing all dishes:<br>${error.message}`,
    }
    res.redirect('/')
  }
})

// * New GET /new
router.get('/new', isSignedIn, async (req, res) => res.render('dishes/new'))

// * Create POST /
router.post('/', isSignedIn, async (req, res) => {
  try {
    // Expects req.body to have .name, .minutes, .recipe, .inredients.
    req.body.owner = req.session.user._id

    // Create the dish in the database.
    await Dish.create(req.body)

    // Schedule a success message and redirect to the index page.
    req.session.message = { class: 'success', text: `Dish added` }
    res.redirect('/dishes')
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error adding dish:<br>${error.message}`,
    }
    res.redirect('/dishes')
  }
})

// * Edit GET /:id/edit
router.get('/:id/edit', isSignedIn, async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('owner')
    res.render('dishes/manage', { dish })
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error editing dish:<br>${error.message}`,
    }
    res.redirect('/dishes')
  }
})

// * Update PUT /:id
router.put('/:id', isSignedIn, async (req, res) => {
  try {
    // Update database entry
    await Dish.findByIdAndUpdate(req.params.id, req.body)

    // Schedule a success message and redirect to the index page
    req.session.message = { class: 'success', text: `Meal updated` }
    res.redirect('/dishes')
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error updating dish:<br>${error.message}`,
    }
    res.redirect('/dishes')
  }
})

// * Delete DELETE /:id
router.delete('/:id', isSignedIn, async (req, res) => {
  try {
    // Validate that the dish is not referenced in a meal
    const meal = await Meal.find({ dish: req.params.id })

    if (meal.length > 0) {
      req.session.message = {
        class: 'info',
        text: 'Dish in use, cannot delete',
      }
      return res.redirect('/dishes')
    }

    // Delete dish in database
    await Dish.findByIdAndDelete(req.params.id)

    // Schedule a success message and redirect to the index page
    req.session.message = { class: 'success', text: `Dish removed` }
    return res.redirect('/dishes')
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error removing dish:<br>${error.message}`,
    }
    res.redirect('/dishes')
  }
})

export default router
