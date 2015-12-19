安装完 nodejs后，
运行pathtohere.bat
1.查看node版本号
输入 node -v   
  5.3.0

2.express相关
https://github.com/expressjs/generator  ----命令行工具
https://github.com/strongloop/express

查看express版本
express -V
4.13.1


3.MongoDB相关
查看版本
启动mongo.exe输入：
 db.version();  
 3.2.0
 
 4.项目支持数据库
 dependencies 中添加一行：
 "mongodb": "3.2.0"
 
 查看安装情况：npm ls mongodb   如果版本不正确 卸载方法  npm uninstall mongodb
 //No compatible version found: mongodb@3.2.0
 改为 2.0.52 版本  且依赖 kerberos
 "kerberos": "0.0.17",
 "mongodb": "2.0.52"
 
5.增加会话支持
 "express-session": "1.12.1",
    "connect-mongo": "1.0.2"
 但传store参数(会话信息存储在数据库中，便于持久维护)，老报  throw new Error('Connection strategy not found'); 错误
 
