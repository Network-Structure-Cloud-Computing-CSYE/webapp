#!/bin/bash

sleep 30


#

# Update the package manager and upgrade installed packages
sudo apt-get update -y

# Install MariaDB server

#sudo apt-get install mariadb-client -y


# Start MariaDB server
# sudo systemctl start mariadb
# sudo mysql -u root -e "create user 'naman'@'localhost' identified by 'password'"
# sudo mysql -u root -e "create database healthcheckdb"
# sudo mysql -u root -e "grant all privileges on healthcheckdb.* to 'naman'@'localhost' identified by 'password'"
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
# mkdir webapp && cd webapp

wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb


sudo groupadd csye6225
sudo useradd -s /bin/bash -g csye6225 -d /home/csye6225 -m csye6225
sudo touch /home/admin/csye6225.log
sudo chmod 766 /home/admin/csye6225.log
sudo chown -R csye6225:csye6225 /home/admin/csye6225.log




sudo mv /home/admin/webapp.zip /home/csye6225/
cd /home/csye6225/ &&  sudo mkdir webapp 
sudo mv /home/csye6225/webapp.zip /home/csye6225/webapp
cd webapp &&  sudo unzip webapp.zip  


sudo chown -R csye6225:csye6225 /home/csye6225/webapp
sudo chmod -R 755 /home/csye6225/webapp


# mv /opt/webapp/* /opt 
# cd /opt 
# sudo chmod +x *

sudo mv /home/csye6225/webapp/user.csv /opt
sudo chmod -R 755 /opt/user.csv

sudo npm i 
# sudo node server.js

# sudo echo '{
#   "agent": {
#     "metrics_collection_interval": 10,
#     "logfile": "/var/logs/amazon-cloudwatch-agent.log"
#   },
#   "logs": {
#     "logs_collected": {
#       "files": {
#         "collect_list": [
#           {
#             "file_path": "/home/csye6225/csye6225.log",
#             "log_group_name": "csye6225",
#             "log_stream_name": "webapp"
#           }
#         ]
#       }
#     },
#     "log_stream_name": "cloudwatch_log_stream"
#   },
#   "metrics": {
#     "metrics_collected": {
#       "statsd": {
#         "service_address": ":8125",
#         "metrics_collection_interval": 15,
#         "metrics_aggregation_interval": 300
#       }
#     }
#   }
# }' > /home/admin/config-file.json

sudo mv /home/admin/config-file.json /home/csye6225/
sudo chown -R csye6225:csye6225 /home/csye6225/config-file.json



#!/bin/bash

# ... (previous script sections)

# Create the service file content
read -r -d '' webapp_service <<EOF
[Unit]
Description=My web application service
After=network.target
Wants=cloud-init.target


[Service]
User=csye6225
Group=csye6225
WorkingDirectory=/home/csye6225/webapp

ExecStart=/usr/bin/node /home/csye6225/webapp/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Write the content to the service file
echo "${webapp_service}" | sudo tee /etc/systemd/system/webapp.service
sudo chown csye6225:csye6225 /etc/systemd/system/webapp.service

# Reload systemd to acknowledge the new service file
sudo systemctl daemon-reload

sudo systemctl enable webapp.service