var crypto = require('crypto');
var User = require('../models/User')
var Post = require('../models/Post')

module.exports = function(app) {
	app.get('/', function(req, res, next) {  //主页
		//res.render('index', { title: '启迪教育' });
    Post.find(null, function(err, posts){
      if(err){
        posts=[];
      }
      res.render('index', {
        title: '启迪教育',
        posts:posts
      });
    })
	});
  app.get('/publish', function(req, res, next) {  //发布
    //console.log("_id:" + req.params.id)
    res.render('publish', {
      title: '启迪教育'
    });
  });

  app.get('/say', function(req, res, next) {  //发布
    res.render('say', {
      title: '启迪教育'
    });
  });
	app.get('/u/:user', function(req, res, next) {  //用户信息
		//res.render('index', { title: '启迪教育' });
    User.find(req.params.user, function(err, user){
      if( !user ){
        req.session.error = '用户不存在';
        return res.redirect("/");
      }
      Post.find(user.name, function(err, posts){
        if(err){
          req.session.error = err;
          return req.redirect("/");
        }
        res.render("user",{
          title:user.name,
          posts:posts
        })
      })
    });
	});

  app.post('/find', function(req, res, next) {  //查询
    //console.log("find:"+req.body.keyValue)
    var searchValue = req.body.keyValue;
    Post.find(null, function(err, posts){
      if(err){
        req.session.error = err;
        return req.redirect("/");
      }
      res.render("posts",{
        posts:posts
      })
    },searchValue)

  });

  app.get('/goModPwd', function(req, res, next) {
    //console.log("_id:" + req.params.id)
    res.render('modpwd', {
      title: '修改密码'
    });
  });

  app.post('/modpwd', function(req, res, next) {  //查询
    //console.log("find:"+req.body.keyValue)
    var newpwd = req.body.newpwd;
    var currentUser = req.session.user;
    if( currentUser === undefined )
      currentUser = {name:"firemail"};

    User.update(currentUser,{password:newpwd}, function(err) {
      if (err) {
        req.session.error = err;
        return res.redirect('/');
      }
      req.session.success = "密码修改成功!";
      res.redirect('/');
    });
  });

  app.post('/recordAdd', function(req, res, next) {  //发布内容
    //res.render('index', { title: '启迪教育' });
    var currentUser = req.session.user;
    if( currentUser === undefined )
      currentUser = {name:"firemail"};
    var postInfo ={title:req.body.title, content:req.body.content, attachment: req.body.attachment,remarks: req.body.remarks, records: req.body.records};
    var post = new Post(currentUser.name, postInfo );
    post.save(function(err) {
      if (err) {
        req.session.error = err;
        return res.redirect('/');
      }
      req.session.success = "发表成功";
      //res.redirect('/u/' + currentUser.name);
      var sendData = { err: null, username:currentUser.name};
      res.send(sendData);
    });
  });

  app.post('/post', function(req, res, next) {  //发布内容
    //res.render('index', { title: '启迪教育' });
    var currentUser = req.session.user;
    if( currentUser === null || currentUser === undefined )
      currentUser = "firemail";
    var postInfo ={title:req.body.title, content:req.body.content};
    var post = new Post(currentUser, postInfo );
    post.save(function(err) {
      if (err) {
        req.session.error = err;
        return res.redirect('/');
      }
      req.session.success = "发表成功";
      res.redirect('/u/' + currentUser);
    });
  });

  app.post('/recordQueryForModify', function(req, res, next) {
    Post.findById(req.body.id, function(err, post){
      if(err){
        console.log(err);
      }
      /*
      //res.redirect('/');//return res.redirect("/publish");
      res.render('publish', {
        id: req.body.id
      });
      */
      var sendData = { err: null, post:post};
      res.send(sendData);
    });
  });

  app.post('/recordQueryForModifyByForm', function(req, res, next) {
    Post.findById(req.body['id'], function(err, post){
      if(err){
        console.log(err);
      }
       res.render('publish', {
         post:post
       });
    });
  });
  app.get('/read', function(req, res, next) {
    Post.findById(req.query.id, function(err, post){
      if(err){
        console.log(err);
      }
      res.render('read', { err: null, post:post });
    });

  });

  app.post('/recordModify', function(req, res, next) {  //发布内容
    //res.render('index', { title: '启迪教育' });
    var currentUser = req.session.user;
    if( currentUser === undefined )
      currentUser = {name:"firemail"};
    var postInfo ={id:req.body.id, title:req.body.title, content:req.body.content, attachment: req.body.attachment,remarks: req.body.remarks, records: req.body.records};
    var post = new Post(currentUser.name, postInfo );
    post.update(function(err) {
      if (err) {
        req.session.error = err;
        return res.redirect('/');
      }
      req.session.success = "发表成功";
      //res.redirect('/u/' + currentUser.name);
      var sendData = { err: null, username:currentUser.name};
      res.send(sendData);
    });
  });


  app.post('/recordDelete', function(req, res, next) {  //删除内容
    var currentUser = req.session.user;
    if( currentUser === undefined )
      currentUser = {name:"firemail"};
    Post.deletyByPostID(req.body.id, function(err, posts){
      if(err){
        console.log(err);
      }
      console.log("---deletyByPostID ")
      var sendData = { err: null, username:currentUser.name};
      res.send(sendData);
    })
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
      var password = req.body.password;//md5.update(req.body.password).digest('base64');
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
		var password = req.body.password;// md5.update(req.body.password).digest("base64");
		//验证用户
    console.log("-----:"+req.body.username);
		User.find(req.body.username, function(err, user){
			//首根据用户名查询是否存在
			if( !user ){
				req.session.error = "用户不存在";
				return res.redirect("/login");
			}
			//验证密码是否正确
			if( user.password != password ){
				req.session.error = "用户密码错误";
				return res.redirect("/login");
			}
			req.session.user = user;
			req.session.success = "登录成功";
			res.redirect("/publish");
		})
	});

	
	app.get('/manageUsers', function (req, res, next) {   //用户管理
		res.send('user manage!');
	});
	
	
};
