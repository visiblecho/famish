const isSignedIn = (req, res, next) => {
  if (req.session.user) return next()
  else res.redirect('/')
}

export default isSignedIn
