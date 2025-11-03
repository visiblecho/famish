import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import isSignedOut from '../middleware/is-signed-out.js'

export const router = express.Router()

// * Routes

// * GET /users/sign-up
router.get('/sign-up', isSignedOut, (req, res) => res.render('/users/sign-up'))

// * POST /users/sign-up
// This route expects a req.body in order to create a user in the database
// TODO Misses family management
router.post('/sign-up', async (req, res) => {
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
router.post('/sign-in', async (req, res) => {
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
    }

    req.session.save(() => res.redirect('/'))
  } catch (error) {
    console.error(error)
    return res.status(500).send('Something went wrong. Please try again later.')
  }
})

// * GET /users/sign-out
router.get('/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('users/sign-out')
  })
})

export default router
