# this is assignment 02

first_name	last_name	email	password
john	doe	john.doe@example.com	abc123
jane	doe	jane.doe@example.com	xyz456



ssh -i ~/.ssh/digitalocean root@143.198.150.247

scp -i ~/.ssh/digitalocean Naman_Gujarathi_002770751_03.zip root@143.198.150.247:/opt   

SSH Terminal

root@debian-s-1vcpu-512mb-10gb-sfo3-01:~# cd /opt
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt# ls
Naman_Gujarathi_002770751_03.zip  digitalocean
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt# 
sudo apt update
sudo apt install unzip
unzip Naman_Gujarathi_002770751_03.zip 
ls
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# ls
'users (2).csv'   webapp

root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt# cd Naman_Gujarathi_002770751_03/
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# ls
'users (2).csv'   webapp
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# rm -rf 'users (2).csv' 
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# ls
webapp

Make sure /opt contains user.csv
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt# ls
 Naman_Gujarathi_002770751_03   Naman_Gujarathi_002770751_03.zip   __MACOSX   digitalocean  'users (2).csv'


root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt# cd Naman_Gujarathi_002770751_03/
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# ls
webapp
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# sudo apt update

root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# sudo apt install mariadb-server

root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# sudo systemctl start mariadb
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# sudo systemctl status mariadb

root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# mysql -u root -p 

Enter

MariaDB [(none)]> ALTER USER 'root'@'localhost' IDENTIFIED BY 'NAM@guj250497';



Query OK, 0 rows affected (0.002 sec)

MariaDB [(none)]> 


MariaDB [(none)]> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> exit
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# sudo apt update 

root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# sudo apt install nodejs npm



root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# ls
webapp
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03# cd webapp/
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03/webapp# ls
README.md  __tests__  api  coverage  jest.config.js  package-lock.json  package.json  server.js

root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03/webapp# npm -v
9.2.0
root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03/webapp# node -v
npm i

node server.js

root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03/webapp# mysql -u root -p // coomand to go in mariadb

NAM@guj250497

MariaDB [(none)]> CREATE DATABASE healthcheckdb;

MariaDB [(none)]> SHOW DATABASES;

exit

root@debian-s-1vcpu-512mb-10gb-sfo3-01:/opt/Naman_Gujarathi_002770751_03/webapp# node server.js




New Terminal for new debian

ssh -i ~/.ssh/digitalocean root@143.198.150.247
curl -v http://localhost:3003/healthz


 
