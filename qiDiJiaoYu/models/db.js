//引入连接配置的模块
var settings = require('../settings');
//得到db对象
var Db = require('mongodb').Db;
//得到连接对象
var Connection = require('mongodb').Connection;
//得到服务对象
var Server = require('mongodb').Server;
//创建连接对象并暴露接口
module.exports = new Db(settings.db, new Server(settings.host, settings.port),{safe: true} );