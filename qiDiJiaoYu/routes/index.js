
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
	app.get('/doReg', function(req, res, next) {  //
		//res.render('index', { title: '启迪教育' });
	});
	app.get('/login', function(req, res, next) {  //
		res.render('login', { title: '用户登录' });
	});
  app.get('/logout', function(req, res, next) {  //
		//res.render('index', { title: '启迪教育' });
	});
	app.get('/doLogin', function(req, res, next) {  //
		//res.render('index', { title: '启迪教育' });
	});

	
	app.get('/manageUsers', function (req, res, next) {   //用户管理
		res.send('user manage!');
	});
	
	
};
