const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const favicon = require('serve-favicon');

const app = express();
const http = require('http').Server(app);

const port = process.env.PORT || '3000';

// Bring in the mongodb
require('./config/database');

// Bring in the models
require('./models/Chatroom');
require('./models/Message');
require('./models/User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRETKEY));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))

// Bring in the routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/chatroom', require('./routes/chatroom'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = http.listen(port, function () {
  console.log(`Server listening on port: ${port}`);
});

// socket.io instantiation
const io = require('socket.io')(server);

// user online list
let users = [];

// socket connection list
let connections = [];

// listen on every connection
io.on('connection', socket => {
  // console.log('New user connected');

  // add the new socket to the connection list
  connections.push(socket);

  // set the first username of the user as 'Anonymous'
  socket.username = 'Anonymous';
  console.log('New user connected: ' + socket.username);


  // listen on emit event name 'set_username' from Client view
  socket.on('set_username', data => {
    // create a random id for the user
    const id = Math.random().toString(36).replace(/[^a-zA-z]+/g, '').substr(0, 10);

    socket.id = id;
    socket.username = data.nickName;

    // add user info to user online list
    users.push({ id: id, username: socket.username });

    // update user online list in the Client view
    updateUserOnlineList();
  });

  // update user online list in the Client view
  const updateUserOnlineList = () => {
    // broadcast user online list to all user connection
    io.sockets.emit('get_users_online', users);
    
  }

  // listen on emit event name 'new_message' from Client view
  socket.on('new_message', data => {
    // broadcast the new message
    io.sockets.emit('new_message', {
      username: data.username,
      message: data.message
    })
  });

  // listen on emit event name 'typing' from Client view
  socket.on('typing', data => {
    socket.broadcast.emit('typing', { username: socket.username })
  });



  // listen on disconnect event when user close windows
  socket.on('disconnect', data => {
    if (!socket.username) return;

    // find user in user online list and delete it
    let user = undefined;
    for (const item of users) {
      if (item.id === socket.id) {
        user = item;
        break;
      }
    };

    // delele user into user online list
    users.splice(user, 1);

    // update user online list
    updateUserOnlineList();

    // delete socket of this user into connection list
    connections.splice(connections.indexOf(socket), 1);
  })

});
// console.log('=============== connections ===============');
// console.log(connections);