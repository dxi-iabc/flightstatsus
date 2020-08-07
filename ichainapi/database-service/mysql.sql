ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
CREATE TABLE user(
   id INT NOT NULL AUTO_INCREMENT,
   username VARCHAR(100) NOT NULL,
   password VARCHAR(50) NOT NULL,
   iATACode VARCHAR(50) NOT NULL,
   fullName VARCHAR(100) NOT NULL,
   type     VARCHAR(50) NOT NULL,
   flag     BOOLEAN,
   isActive BOOLEAN,
   PRIMARY KEY ( id )
);
INSERT INTO user (userName,password,iATACode,fullName,type,flag,isActive) VALUES ("gatwickairport","Flightchain","LGW","Gatewick Airport","airport",False,True);
INSERT INTO user (userName,password,iATACode,fullName,type,flag,isActive) VALUES ("britishairways","Flightchain","ba","BRITISH AIRWAYS","airline",True,True);
            