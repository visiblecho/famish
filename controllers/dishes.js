import express from 'express'
import isSignedIn from '../middleware/is-signed-in.js'
import Dish from '../models/dish.js'

const router = express.Router()

// * Routes

// * Index GET /
router.get('/', isSignedIn, async (req, res) => {
  const familyId = req.session.user.family

  // Get dishes from the database
  const familyDishes = await Dish.find().populate({
    path: 'owner',
    match: { family: familyId }, // only where owner.family matches user.familyID
  })

  // Remove dishes where owner is null (because match didn't pass)
  const filteredDishes = familyDishes.filter((dish) => dish.owner)

  res.render('dishes/index', { dishes: filteredDishes })
})

// * New GET /new
router.get('/new', isSignedIn, async (req, res) => res.render('dishes/new'))

// * Create POST /
router.post('/', isSignedIn, async (req, res) => {
  // add try catch
  req.body.owner = req.session.user._id
  const createdDish = await Dish.create(req.body)
  // add success message
  res.redirect('/dishes')
})

// * Edit GET /:id/edit
router.get('/:id', isSignedIn, (req, res) => res.render('dishes/manage'))

// * Update PUT /:id
router.put('/:id', isSignedIn, (req, res) => {
  res.send('Put', req.body)
})

// * Delete DELETE /:id
router.delete('/:id', isSignedIn, (req, res) => {
  res.send('Delete', req.body)
})

export default router
