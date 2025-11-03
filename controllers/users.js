import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import isSignedOut from '../middleware/is-signed-out.js'
import isSignedIn from '../middleware/is-signed-in.js'

const router = express.Router()

// * Routes

// * GET /users/sign-up
router.get('/sign-up', isSignedOut, (req, res) => res.render('users/sign-up'))

// * POST /users/sign-up
// This route expects a req.body in order to create a user in the database
// TODO Misses family management
router.post('/sign-up', isSignedOut, async (req, res) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    const usernameInDatabase = await User.findOne({ username })
    if (usernameInDatabase)
      return res.status(400).send('Username already taken')

    const emailInDatabase = await User.findOne({ email: email })
    if (emailInDatabase) return res.status(400).send('Email already taken')

    req.body.password = bcrypt.hashSync(password, 12)

    const createdUser = await User.create(req.body)
    console.log(createdUser)

    req.session.user = {
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      family: createdUser.family,
    }

    req.session.save(() => res.redirect('/'))
  } catch (error) {
    console.error(error)
    return res.status(500).send('Something went wrong. Please try again later.')
  }
})

// * GET /users/sign-in
router.get('/sign-in', isSignedOut, (req, res) => res.render('users/sign-in'))

// * POST /users/sign-in
// This route expects a req.body in order to search for a matching user
router.post('/sign-in', isSignedOut, async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username })
    if (!existingUser)
      return res.status(401).send('The username provided was not found.')

    if (!bcrypt.compareSync(req.body.password, existingUser.password)) {
      return res.status(401).send('Incorrect password was provided.')
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
    return res.status(500).send('Something went wrong. Please try again later.')
  }
})

// * GET /users/sign-out
router.get('/sign-out', isSignedIn, (req, res) => {
  req.session.destroy(() => {
    res.render('users/sign-out')
    // TODO There is a race condition. The sign-out page still access the session data (e.g., username)
  })
})

// * GET /users/:id -- manage
router.get('/:id', isSignedIn, (req, res) => res.render('users/manage'))

export default router
