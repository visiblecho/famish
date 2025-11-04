const passPathToView = (req, res, next) => {
  res.locals.currentPath = req.path
  next()
}

export default passPathToView
