const router = require('express').Router();
const auth = require('../middleware/authorization');

router.get('/', auth, function (req, res, next) {
  res.render('index.pug', { title: 'Welcome to Chat App real-time' });
});

module.exports = router;
