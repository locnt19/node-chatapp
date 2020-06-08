const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    // if (!req.signedCookies.auth) {
    if (!req.cookies.auth) {
      res.redirect('/user/login');
      return;
    }
    // const token = req.signedCookies.auth;
    const token = req.cookies.auth;
    const user = await jwt.verify(token, process.env.SECRETKEY);
    // console.log('signedCookies: ' + token);
    // console.log('token decoded: ' + user);
    
    res.locals.user = {
      id: user.id,
      name: user.name
    };
    console.log('====== user logged ======');
    console.log(res.locals.user);
    next()
  } catch (err) {
    res.status(403).send('Unauthorized!')
  }
}