function protectAdminRoute(req, res, next) {

  const isAuthorized = req.session.currentUser;
  if (isAuthorized) {
    next(); // executes the next middleware in line OR the callback handling the request if this is the last middleware in line
  } else {
    res.redirect("/signin");
  }
}

module.exports = protectAdminRoute;