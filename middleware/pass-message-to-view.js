const passMessageToView = (req, res, next) => {
  res.locals.message = req.session.message ? req.session.message : undefined
  req.session.message = undefined
  next()
}

export default passMessageToView
