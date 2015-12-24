var mongodb = require('./db');
var settings = require('../settings');

function User(user) {
  this.name = user.name;
  this.password = user.password;
	this.email = user.email;
};
/*
*增加查询用户静态方法
*@param username 用户名
*@param cllback
*/
User.find = function(username, callback) {
	mongodb.open( function(err, db){
		if( err ){
			return callback(err);
		}
    //db.authenticate(settings.username,settings.password ,function(err, r){
   //   if( err ){
   //     return callback(err);
   //   }
      db.collection("users", function(err, collection){
        if( err ){
          mongodb.close();
          return callback(err);
        }
        //查找name属性为username的文档
        collection.findOne({name:username}, function(err, doc){
          mongodb.close();
          if( doc ){
            //封装文档为User对象
            var user = new User(doc);
            callback(err, user);
          } else {
            callback(err, null);
          }
        })
      })
    //});

	})
}
//将User类导出接口
module.exports = User;


//增加保存方法
User.prototype.save = function save(callback) {
  // 存入 Mongodb 的文檔
  var user = {
    name: this.name,
    password: this.password,
		email: this.email,
  };
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //db.authenticate(settings.username,settings.password ,function(err, r){
     // if( err ){
      //  return callback(err);
      //}
      // 讀取 users 集合
      db.collection('users', function(err, collection) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        // 爲 name 屬性添加索引
        collection.ensureIndex('name', {unique: true});
        // 寫入 user 文檔
        collection.insert(user, {safe: true}, function(err, user) {
          mongodb.close();
          callback(err, user);
        });
      });
   // });

  });
};

///////////////////

User.update = function update(username, arr, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.authenticate(settings.username,settings.password ,function(){
      callback(err, db);
    });
    // 讀取 users 集合
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 查找 name 屬性爲 username 的文檔
      collection.update({name: username},{'$set':arr}, function(err, username) {
        mongodb.close();
        callback(err, username);
      });
    });
  });
};
