const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const sha256 = require('js-sha256');
const User = mongoose.model('User');

exports.renderLoginTemplate = (req, res) => {
  res.render('login.pug', { title: 'Login page' })
}
exports.renderRegisterTemplate = (req, res) => {
  res.render('register.pug', { title: 'Register page' })
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com$/;
    const userExists = await User.findOne({ email });
    if (!emailRegex.test(email)) throw 'Email is not supported.';
    if (password.length < 6) throw 'Password must be at least 6 characters long.';
    if (userExists) throw 'User with same email already exist.'

    const newUser = new User({
      name,
      email,
      password: sha256(password + process.env.SALT)
    })
    await newUser.save();
    res.render('login.pug', { title: 'Login page', message: 'Created. Please login.' });
  } catch (error) {
    res.render('register.pug', { title: 'Register page', message: error })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
      password: sha256(password + process.env.SALT)
    });
    // console.log(user);
    if (!user) throw 'Email or password did not match.';
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.SECRETKEY);
    res.cookie('auth', token, { maxAge: 60 * 60 * 1000 });
    // res.cookie('auth', token, { signed: true, maxAge: 60 * 60 * 1000 });
    res.redirect('/');
  } catch (error) {
    res.render('login.pug', { title: 'Login page', message: error });
  }
}

exports.logout = (req, res) => {
  res.clearCookie('auth');
  res.redirect('/');
}