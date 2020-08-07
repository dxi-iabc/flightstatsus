#!/bin/bash


read -p "enter the user password: "
sudo mysql -u root -p$REPLY <<EOF
#SELECT user,authentication_string,plugin,host FROM mysql.user;
#ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'blockchain';
#FLUSH PRIVILEGES;
#SELECT user,authentication_string,plugin,host FROM mysql.user;
#CREATE USER 'root'@'localhost' IDENTIFIED BY 'blockchain';
#GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
CREATE DATABASE sitafc;
USE sitafc;
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
INSERT INTO user 
        (userName,password,iATACode,fullName,type,flag,isActive) 
        VALUES 
	       ("gatwickairport","Flightchain","LGW","Gatewick Airport","airport",False,True),
	       ("britishairways","Flightchain","ba","BRITISH AIRWAYS","airline",True,True),
            ("heathrew","Flightchain","lhr","Heathrew Airport","airport",False,True),
            ("miami","Flightchain","mia","Miami Airport","airport",False,True),
            ("geneva","Flightchain","gva","Geneva Airport","airport",False,True),
            ("quantas","Flightchain","qfa","Quantas Airways","airline",True,True);

exit
EOF
echo "===Table insertion completed===*"


