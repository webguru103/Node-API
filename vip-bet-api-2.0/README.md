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

##setup pm2 services ##
* pm2 start ~/vipbet/AdminClient/app.js --name="admin_client"
* pm2 start ~/vipbet/API/app.js --name="api_gateway"
* pm2 start ~/vipbet/BetSlipService/src/app.js --name="betslip_service"
* pm2 start ~/vipbet/CategoryService/src/app.js --name="category_service"
* pm2 start ~/vipbet/CommonService/src/app.js --name="common_service"
* pm2 start ~/vipbet/EventMarketService/src/app.js --name="event_market_service"
* pm2 start ~/vipbet/EventService/src/app.js --name="event_service"
* pm2 start ~/vipbet/ResultService/src/app.js --name="result_service"
* pm2 start ~/vipbet/MappingService/src/app.js --name="mapping_service"
* pm2 start ~/vipbet/MarketService/src/app.js --name="market_service"
* pm2 start ~/vipbet/ParticipantService/src/app.js --name="participant_service"
* pm2 start ~/vipbet/WarningService/src/app.js --name="warning_service"
* pm2 start ~/vipbet/parsers/LadbrokesParser/src/app.js --name="parser_ladbrokes_service"
* pm2 start ~/vipbet/parsers/MyBetParser/src/app.js --name="parser_my_bet_service"
* pm2 start ~/vipbet/parsers/RedKingsParser/src/app.js --name="parser_red_kings_service"
* pm2 start ~/vipbet/parsers/WHillsParser/src/app.js --name="parser_whills_service"
* pm2 start ~/vipbet/parsers/BetAtHomeParser/src/app.js --name="parser_bet_at_home_service"
* pm2 start ~/vipbet/parsers/SBTechParser/src/app.js --name="parser_sb_tech_service"
* pm2 start ~/vipbet/parsers/Sports888Parser/src/app.js --name="parser_888_sports_service"
* pm2 start ~/vipbet/parsers/Bet365Parser/src/app.js --name="parser_bet_365_service"
* pm2 start ~/vipbet/parsers/CoralParser/src/app.js --name="parser_coral_service"
* pm2 start ~/vipbet/parsers/BetssonParser/src/app.js --name="parser_betsson_service"
* pm2 start ~/vipbet/parsers/BetwayParser/src/app.js --name="parser_bet_way_service"
* pm2 start ~/vipbet/parsers/BetFairParser/src/app.js --name="parser_bet_fair_service"
* pm2 start ~/vipbet/parsers/IntertopsParser/src/app.js --name="parser_intertops_service"

##setup pm2 for recover services on restart ##
* pm2 save
* sudo pm2 startup ubuntu14

## restart services after server (AWS) restart ##
* pm2 resurrect

## how to restore db ##
* drop existing db: dropdb -U postgres <db_name>
* create new fresh db: createdb -U postgres <db_name>
* restore db: -U postgres -d <db_name> -f <sql_dump_path.backup>