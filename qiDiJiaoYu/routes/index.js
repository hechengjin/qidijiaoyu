var crypto = require('crypto');
var User = require('../models/User')
module.exports = function(app) {
	app.get('/', function(req, res, next) {  //主页
		res.render('index', { title: '启迪教育' });
	});
	app.get('/users/:user', function(req, res, next) {  //用户信息
		//res.render('index', { title: '启迪教育' });
	});
	app.get('/post', function(req, res, next) {  //发布内容
		//res.render('index', { title: '启迪教育' });
	});	
	app.get('/reg', function(req, res, next) {  //注册
		res.render('reg', { title: '用户注册', layout: 'layout' });
	});
  app.post('/doReg', function(req, res, next) {  //
      //res.render('index', { title: '启迪教育' });
      //檢驗用戶兩次輸入的口令是否一致
      if (req.body['password-repeat'] != req.body['password']) {
          req.session.error="两次输入的口令不一致";
          return res.redirect('/reg');
      }
      //生成口令的散列值
      var md5 = crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('base64');
      //声明需要添加的用户
      var newUser = new User({
          name: req.body.username,
          password: password,
          email: req.body.email,
      });

      //檢查用戶名是否已經存在
      User.find(newUser.name, function(err, user) {
          if (user){
              req.session.error = '该用户已经存在';
              return res.redirect('/reg');
          }
          //如果不存在則新增用戶
          newUser.save(function(err) {
              if (err) {
                  req.session.error = err;
                  return res.redirect('/reg');
              }
              req.session.user = newUser;
              req.session.success = "注册成功";
              res.locals.user = newUser;
              res.redirect('/');
          });
      });

  });
	app.get('/login', function(req, res, next) {  //
		res.render('login', { title: '用户登录' });
	});
  app.get('/logout', function(req, res, next) {  //
		//res.render('index', { title: '启迪教育' });
		req.session.user = null;
		req.session.success="退出成功";
		res.redirect("/");
	});
	app.post('/doLogin', function(req, res, next) {  //
		//res.render('index', { title: '启迪教育' });
		var md5 = crypto.createHash("md5");
		var password = md5.update(req.body.password).digest("base64");
		//验证用户
		User.find(req.body.username, function(err, user){
			//首根据用户名查询是否存在
			if( !user ){
				req.session.error = "用户不存在";
				return req.redirect("/login");
			}
			//验证密码是否正确
			if( user.password != password ){
				req.session.error = "用户密码错误";
				return res.redirect("/login");
			}
			req.session.user = user;
			req.session.success = "登录成功";
			res.redirect("/");
		})
	});

	
	app.get('/manageUsers', function (req, res, next) {   //用户管理
		res.send('user manage!');
	});
	
	
};
