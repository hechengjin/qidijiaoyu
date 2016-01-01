var mongodb = require('./db');
var settings = require('../settings');

function Post(username, post, time) {
  this.user = username;
  this.title = post.title;
  this.content = post.content;
  this.attachment = post.attachment;
  this.remarks = post.remarks;
  this.records = post.records;
  if (time) {
    this.time = time;
  } else {
    this.time = new Date().getTime();
  }
};


Post.find = function get(username, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    /*db.authenticate(settings.username,settings.password ,function(err, r){
      if( err ){
        console.log(err+"----------------")
        return callback(err);
      }
      */
      // 讀取 posts 集合
      db.collection('posts', function(err, collection) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
        var query = {};
        if (username) {
          query.user = username;
        }
        collection.find(query).sort({time: -1}).toArray(function(err, docs) {
          mongodb.close();
          if (err) {
            callback(err, null);
          }
          // 封裝 posts 爲 Post 對象
          var posts = [];
          docs.forEach(function(doc, index) {
            var postTime = new Date(doc.time);
            postTime = postTime.toLocaleDateString() + " " + postTime.toLocaleTimeString();
            var postInfo ={title:doc.title, content:doc.content}
            var post = new Post(doc.user, postInfo, postTime);
            posts.push(post);
          });
          callback(null, posts);
        });
      });
   // });

  });
};

module.exports = Post;


Post.prototype.save = function save(callback) {
  // 存入 Mongodb 的文檔
  var post = {
    user: this.user,
    title: this.title,
    content: this.content,
    attachment: this.attachment,
    remarks: this.remarks,
    records: this.records,
    time: this.time,
  };
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.authenticate(settings.username,settings.password ,function(err, r){
      // 讀取 posts 集合
      db.collection('posts', function(err, collection) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        // 爲 user 屬性添加索引
        collection.ensureIndex('user');
        // 寫入 post 文檔
        collection.insert(post, {safe: true}, function(err, post) {
          mongodb.close();
          callback(err, post);
        });
      });
    });
  });
};
/*
//获取分页数据
Post.getUserPage = function getUserPage(username,page,size, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 讀取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
      var query = {};
      if (username) {
        query.user = username;
      }
      var startpage = 0;
      if(page>0){
          startpage = size*(page-1);
      }else{
          startpage = 0
      }
      collection.find(query).sort({time: -1}).limit(size).skip(startpage).toArray(function(err, docs) {
        mongodb.close();
        if (err) {
          callback(err, null);
        }
        // 封裝 posts 爲 Post 對象
        var posts = [];
        docs.forEach(function(doc, index) {
          var post = new Post(doc.user, doc.post, doc.time);
          posts.push(post);
        });
        callback(null, posts);
      });
    });
  });
};
//获取用户微博总数
Post.getUserTotal = function getUserTotal(username, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 讀取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
      var query = {};
      if (username) {
        query.user = username;
      }
      collection.count(query,function(err,count){
          mongodb.close();
          callback(err, count);
      });
    });
  });
};
*/