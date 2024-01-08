// @ts-nocheck
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config()

const expressSession = require("express-session")
var indexRouter = require('./routes/index');
var usersRouter = require('./models/users');
const passport = require('passport');
const flash = require("connect-flash")
var app = express();
// const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Serve Socket.IO client library
// app.use("/socket.io", express.static("node_modules/socket.io/client-dist"));
app.get("/socket.io/socket.io.js.map", (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js.map');
});
// Socket.IO setup
io.on('connection', function(socket) {
  console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });
});
 



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "hey hello bro"
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;