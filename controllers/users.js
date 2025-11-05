import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import isSignedOut from '../middleware/is-signed-out.js'
import isSignedIn from '../middleware/is-signed-in.js'
import Family from '../models/family.js'

const router = express.Router()

// * Routes

// * GET /users/sign-up
router.get('/sign-up', isSignedOut, (req, res) => res.render('users/sign-up'))

// * POST /users/sign-up
// This route expects a req.body in order to create a user in the database
router.post('/sign-up', isSignedOut, async (req, res) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const familycode = req.body.familycode
    let family

    const usernameInDatabase = await User.findOne({ username })
    if (usernameInDatabase) {
      req.session.message = {
        class: 'info',
        text: `Username already taken`,
      }
      return res.redirect('/users/sign-up')
    }

    const emailInDatabase = await User.findOne({ email: email })
    if (emailInDatabase) {
      req.session.message = {
        class: 'info',
        text: `Email already registered`,
      }
      return res.redirect('/users/sign-up')
    }

    req.body.password = bcrypt.hashSync(password, 12)

    if (!familycode) {
      // Create a new family
      family = await Family.create({ name: 'No Name Yet' })
      req.body.family = family._id
    } else {
      // Check that the family is in the database
      family = await Family.findOne({ familycode })
      if (!family) {
        req.session.message = {
          class: 'info',
          text: `Family code invalid`,
        }
        return res.redirect('/users/sign-up')
      }
      // Add the correct id
      req.body.family = family._id
    }

    const createdUser = await User.create(req.body)
    console.log(createdUser)

    req.session.user = {
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      family: createdUser.family,
      familycode: family.familycode,
    }

    req.session.save(() => res.redirect('/'))
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error signing up:<br>${error.message}`,
    }
    res.redirect('/')
  }
})

// * GET /users/sign-in
router.get('/sign-in', isSignedOut, (req, res) => res.render('users/sign-in'))

// * POST /users/sign-in
// This route expects a req.body in order to search for a matching user
router.post('/sign-in', isSignedOut, async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username })
    if (!existingUser) {
      req.session.message = {
        class: 'info',
        text: `Username unknwon`,
      }
      return res.redirect('/users/sign-in')
    }

    if (!bcrypt.compareSync(req.body.password, existingUser.password)) {
      req.session.message = {
        class: 'info',
        text: `Password incorrect`,
      }
      return res.redirect('/users/sign-in')
    }

    req.session.user = {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      family: existingUser.family,
    }

    req.session.save(() => res.redirect('/'))
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error signing in:<br>${error.message}`,
    }
    res.redirect('/')
  }
})

// * GET /users/sign-out
router.get('/sign-out', isSignedIn, (req, res) => {
  req.session.destroy(() => {
    res.locals.user = undefined
    res.render('users/sign-out')
  })
})

// * GET /users/:id -- manage
router.get('/:id', isSignedIn, async (req, res) => {
  try {
    const familyMembers = await User.find({
      family: req.session.user.family,
    })
    const memberNames = familyMembers.map((m) => m.username)
    res.render('users/manage', { memberNames })
  } catch (error) {
    console.error(error)
    req.session.message = {
      class: 'warning',
      text: `Error showing user data:<br>${error.message}`,
    }
    res.redirect('/')
  }
})

export default router
