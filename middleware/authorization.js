const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    // if (!req.headers.authorization) throw res.status(403).send('hja')
    const token = req.headers.authorization.replace('Bearer ', '')
    const payload = await jwt.verify(token, process.env.SECRETKEY)
    req.payload = payload
    next()
  } catch (err) {
    res.status(403).send('Unauthorized!')
  }
}