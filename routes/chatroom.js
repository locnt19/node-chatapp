const router = require('express').Router();
const auth = require('../middleware/authorization');

/* GET chatroom page. */
router.get('/', auth, function (req, res, next) {
  res.send('Authorization.')
});

module.exports = router;
