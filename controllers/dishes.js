import express from 'express'
import isSignedIn from '../middleware/is-signed-in.js'
import Dish from '../models/dish.js'

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
      text: `Error showing dishes:<br>${error.message}`,
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
router.get('/:id', isSignedIn, (req, res) => res.render('dishes/manage'))

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
    res.redirect('/dishes')
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
    res.redirect('/dishes')
  }
})

export default router
