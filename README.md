# README #

Node.js sportsbetting API with Betslip, Tipster and Tipster Leaderboard using Microservices.

Also features a Admin Panel.


### How do I get set up? ###

* pull this repository
* all configs can be found in "config/configuration.json"
* install Node.js >= v7.x
* install Postgres server
* install RabbitMQ
* sudo npm install typescript -g
* sudo npm install -g pm2
* run database migration 

## config RabbitMQ ##
* sudo rabbitmqctl add_user vbadmin g0s5a
* sudo rabbitmqctl set_user_tags vbadmin administrator
* sudo rabbitmqctl add_vhost vb
* sudo rabbitmqctl set_permissions -p vb vbadmin ".*" ".*" ".*"
* sudo rabbitmq-plugins enable rabbitmq_management

## database deployment ## 
* edit config file: sudo nano /etc/postgresql/9.1/main/postgresql.conf
* change max_connection to 500
* sudo sysctl -w kernel.shmmax=100663296
* sudo -u postgres psql
* \password postgres
* type new password "qwerty1" or whatever but then change it in configuration.json also (in configuration.json password now is qwerty1
* sudo /etc/init.d/postgresql restart
* cd migrations
* npm install
* node latest

## Admin Frontend ##
* visit http://localhost:4000
