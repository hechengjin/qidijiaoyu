var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  /*
  //先不传store参数，老报  throw new Error('Connection strategy not found'); 错误
  store: new MongoStore({
      db: settings.db,
      host: settings.host,
      port: settings.port
  })
  */
  resave:false,
  saveUninitialized:true
}));

//使用中间件来返回成功和失败的信息
app.use(function(req, res, next){
  var err = req.session.error
  , msg = req.session.success;
  //删除会话中原有属性
  delete req.session.error;
  delete req.session.success;
  //将错误和正确信息存放到动态视图助手变量中
  res.locals.message = '';
  if( err ){
    res.locals.message = '<div class="alert alert-error">' + err + '</div>';
  }
  if( msg ){
    res.locals.message = '<div class="alert alert-success">' + msg + '</div>';
  }
  next();
});
//使用中间件把user设置成动态视图助手
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
