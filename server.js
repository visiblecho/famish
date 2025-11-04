// * Frameworks and Libraries

import express from 'express'
import session from 'express-session'
import methodOverride from 'method-override'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import morgan from 'morgan'
import 'dotenv/config'

// * Own modules

import usersRouter from './controllers/users.js'
import mealsRouter from './controllers/meals.js'
import dishesRouter from './controllers/dishes.js'

import passUserToView from './middleware/pass-user-to-view.js'
// import isSignedOut from './middleware/is-signed-out.js'
import isSignedIn from './middleware/is-signed-in.js'

// * Global variables

const app = express()
app.set('view engine', 'ejs')

// * Middleware

app.use(morgan('dev'))
app.use(express.urlencoded())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
)

app.use(passUserToView)

// * Routes

app.get('/', (req, res) => {
  if (req.session.user) res.redirect('/meals')
  else res.render('index')
})

app.use('/users', usersRouter)

app.use(isSignedIn)

app.use('/meals', mealsRouter)
app.use('/dishes', dishesRouter)

// * Connections

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Database connection established')
    app.listen(3000, () => {
      console.log('Server listening at port 3000')
    })
  } catch (error) {
    console.error(error)
  }
}
connect()
