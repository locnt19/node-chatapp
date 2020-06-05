const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/login', userController.renderLoginTemplate);
router.get('/register', userController.renderRegisterTemplate);
router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;