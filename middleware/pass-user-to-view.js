const passUserToView = (req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : undefined
  next()
}

export default passUserToView
