const isFamilyMember = (req, res, next) => {
  // TODO: Check that the family is correct!
  if (req.session.user) return next()
  else res.redirect('/')
}

export default isFamilyMember
