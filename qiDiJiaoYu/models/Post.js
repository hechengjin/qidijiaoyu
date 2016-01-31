var mongodb = require('./db');
var settings = require('../settings');

function Post(username, post, time) {
  this.user = username;
  this.id = 0;
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
  if( post.id ){
    this.id = post.id;
  }
  //console.log( "this.id:" + this.id + " +++++")
};


Post.find = function find(username, callback, searchValue) {

  if( searchValue === undefined ){
    searchValue = null;
  }
  console.log("find searchValue:"+searchValue + " username:"+username)
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
        var queryContent = {};
        if (username) {
          query.user = username;
        }
          if (searchValue) {
            query['title']=new RegExp(searchValue);//模糊查询参数
            //query['content']=new RegExp(searchValue);
            queryContent['content']=new RegExp(searchValue);
          }
        var queryCon ={};
        if (username) {
          queryCon = query;
        } else{
          queryCon ={"$or": [query,queryContent,{"records":{$elemMatch:query}},{"records":{$elemMatch:queryContent}}]};
        }
        collection.find(queryCon).sort({time: -1}).limit(100).toArray(function(err, docs) {
          mongodb.close();
          if (err) {
            callback(err, null);
          }
          // 封裝 posts 爲 Post 對象
          var posts = [];
          docs.forEach(function(doc, index) {
            var postTime = new Date(doc.time);
            postTime = postTime.toLocaleDateString() + " " + postTime.toLocaleTimeString();
            var postInfo ={id:doc._id.toString(), title:doc.title, content:doc.content}
            var post = new Post(doc.user, postInfo, postTime);
            posts.push(post);
          });
          callback(null, posts);
        });
      });
   // });

  });
};

Post.findById = function findById(postId, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
      var query = {};
      if (postId) {
        var obj_id = require('mongodb').ObjectID.createFromHexString(postId);
        query._id = obj_id;
      }
      collection.find(query).sort({time: -1}).toArray(function(err, docs) {
        mongodb.close();
        if (err) {
          callback(err, null);
        }
        var posts = [];
        docs.forEach(function(doc, index) {
          var postTime = new Date(doc.time);
          postTime = postTime.toLocaleDateString() + " " + postTime.toLocaleTimeString();
          var contentTrans =  doc.content.replace(/\"/g,"\'")
          var postInfo ={id:doc._id.toString(), title:doc.title, content:contentTrans, attachment: doc.attachment,
                          remarks: doc.remarks, records: doc.records}
          var post = new Post(doc.user, postInfo, postTime);
          posts.push(post);
        });
        callback(null, posts[0]);
      });
    });
  });
};



Post.deletyByPostID = function deletyByPostID(postId, callback) {
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
      var query = {};
      if (postId) {
        //var BSON = require('mongodb').BSONPure;
        //console.log(Object.keys())
        //console.log(postId)
        var obj_id = require('mongodb').ObjectID.createFromHexString(postId);
        query._id = obj_id;
      }
      collection.remove(query ,{safe:true},function(err,result) {
        mongodb.close();
        if (err) {
          callback(err, null);
        }
        callback(null, null);
      });
    });
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
   // db.authenticate(settings.username,settings.password ,function(err, r){
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
    //});
  });
};


Post.prototype.update = function update(callback) {
  // 存入 Mongodb 的文檔
  var post = {
    //user: this.user,
    title: this.title,
    content: this.content,
    attachment: this.attachment,
    remarks: this.remarks,
    records: this.records,
    //time: this.time,
  };
  var self = this;
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // db.authenticate(settings.username,settings.password ,function(err, r){
    // 讀取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      console.log("self.id:"+self.id)
      if (self.id != 0 ) {
        var obj_id = require('mongodb').ObjectID.createFromHexString(self.id);
        query._id = obj_id;
        collection.update(query, {$set:post},{safe: true}, function(err,result) {
          mongodb.close();
          callback(err, result);
        });
      } else {
        mongodb.close();
      }
    });
    //});
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