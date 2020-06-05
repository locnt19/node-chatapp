const router = require('express').Router();
const auth = require('../middleware/authorization');
/* GET home page. */
router.get('/', auth, function (req, res, next) {
  res.render('index.pug', { title: 'Index page' });
});

module.exports = router;
