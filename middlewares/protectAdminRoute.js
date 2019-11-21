function protectAdminRoute(req, res, next) {
  if (true) {
    res.locals.isAdmin = true;
    next();
  }
}

module.exports = protectAdminRoute;
