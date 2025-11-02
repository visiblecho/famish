// * Frameworks and Libraries

import express from 'express'
import ejs from 'ejs'
import session from 'express-session'
import methodOverride from 'method-override'

import 'dotenv/config'

// * Own modules

// * Global variables

const app = express()
app.set('view engine', 'ejs')

// * Middleware

app.use(express.urlencoded())
app.use(methodOverride('_method'))
app.use(express.static('public'))
/*
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}))
*/

// * Routes

app.get('', (req, res) => res.render('index'))

app.listen(3000, () => {
  console.log('Server listening at port 3000')
})
