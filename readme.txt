��װ�� nodejs��
����pathtohere.bat
1.�鿴node�汾��
���� node -v   
  5.3.0

2.express���
https://github.com/expressjs/generator  ----�����й���
https://github.com/strongloop/express

�鿴express�汾
express -V
4.13.1


3.MongoDB���
�鿴�汾
����mongo.exe���룺
 db.version();  
 3.2.0
 
 4.��Ŀ֧�����ݿ�
 dependencies �����һ�У�
 "mongodb": "3.2.0"
 
 �鿴��װ�����npm ls mongodb   ����汾����ȷ ж�ط���  npm uninstall mongodb
 //No compatible version found: mongodb@3.2.0
 ��Ϊ 2.0.52 �汾  ������ kerberos
 "kerberos": "0.0.17",
 "mongodb": "2.0.52"
 
5.���ӻỰ֧��
 "express-session": "1.12.1",
    "connect-mongo": "1.0.2"
 ����store����(�Ự��Ϣ�洢�����ݿ��У����ڳ־�ά��)���ϱ�  throw new Error('Connection strategy not found'); ����
 
