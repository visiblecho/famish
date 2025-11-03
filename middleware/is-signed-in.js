const isSignedIn = (req, res, next) => {
  console.log(req.session)
  if (req.session.user) {
    console.log('signed-in as', req.session.user)
    return next()
  }
  console.log('not signed-in')
  res.redirect('/')
}

export default isSignedIn
