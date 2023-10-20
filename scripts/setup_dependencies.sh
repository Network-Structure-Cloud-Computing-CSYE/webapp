#!/bin/bash

sleep 30




# Update the package manager and upgrade installed packages
sudo apt-get update -y

# Install MariaDB server
sudo apt install -y mariadb-server

# Start MariaDB server
sudo systemctl start mariadb
sudo mysql -u root -e "create user 'naman'@'localhost' identified by 'password'"
sudo mysql -u root -e "create database healthcheckdb"
sudo mysql -u root -e "grant all privileges on healthcheckdb.* to 'naman'@'localhost' identified by 'password'"
# Change the MySQL root password to match that in configuration file
# mysql -u root -proot -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'password'; CREATE DATABASE IF NOT EXISTS db_sequelize_mysql; FLUSH PRIVILEGES;"
# sudo mysql -u admin_user -padmin_password -e "ALTER USER 'admin_user'@'localhost' IDENTIFIED BY 'new_password'; CREATE DATABASE IF NOT EXISTS db_sequelize_mysql; FLUSH PRIVILEGES;"
# sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'NAM@guj250497'; CREATE DATABASE IF NOT EXISTS healthcheckdb; FLUSH PRIVILEGES;"
# Install Node.js and npm
sudo apt install -y nodejs npm

# Check Node.js and npm versions
node -v
npm -v
pwd

sudo apt install -y unzip
# mkdir webapp && cd webapp
pwd
# sudo mv /home/admin/webapp.zip /home/admin/webapp
sudo unzip webapp.zip   
# mv /opt/webapp/* /opt 
# cd /opt 
# sudo chmod +x *
ls
sudo mv /home/admin/webapp/user.csv /opt
pwd
sudo ls -al
cd webapp
sudo npm i 
# sudo node server.js
