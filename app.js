const express = require('express');
const app = express();
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose')
require('dotenv/config')
const logger = require('morgan');
const path = require('path');
const createError = require('http-errors');

app.use(compression()); // Compress all routes
app.use(helmet());  

mongoose.connect(process.env.DB_CONNECTOR)
const db = mongoose.connection

// Use Express's built-in middleware for parsing
app.use(express.json()); // For parsing JSON (part of the express we don't need body-parser anymore)
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

db.once('open', _ => {
  console.log('DB connection is live')
})

db.on('error', err => {
  console.error('connection error:', err)
})

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// use v1 as version 1 in the future we can add other endpoint is that is necessarily
const User = require('./routes/user')
app.use('/v1/user', User)

const Post = require('./routes/post')
app.use('/v1/post', Post)

const Comment = require('./routes/comment')
app.use('/v1/comment', Comment)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;    
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000, () => {
    console.log('Hi there...')
})
