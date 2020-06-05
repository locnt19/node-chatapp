const router = require('express').Router();
const auth = require('../middleware/authorization');

/* GET chatroom page. */
router.get('/', auth, function (req, res, next) {
  res.render('chatroom.pug', { title: 'chatroom' });
});

module.exports = router;
