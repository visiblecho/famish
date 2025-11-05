const passMessageToView = (req, res, next) => {
  console.log(req.session.message)
  res.locals.message = req.session.message ? req.session.message : undefined
  // req.session.message = undefined
  next()
}

export default passMessageToView
