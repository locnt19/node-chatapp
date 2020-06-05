const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    if (!req.signedCookies.auth) {
      res.redirect('/user/login');
      return;
    }
    // const payload = await jwt.verify(token, process.env.SECRETKEY)
    next()
  } catch (err) {
    res.status(403).send('Unauthorized!')
  }
}