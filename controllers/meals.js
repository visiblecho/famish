import express from 'express'
import isSignedIn from '../middleware/is-signed-in.js'

const router = express.Router()

// * Routes

router.get('/', isSignedIn, (req, res) => {
  res.render('meals/index')
})

export default router
