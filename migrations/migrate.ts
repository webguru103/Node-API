import * as  Bluebird from 'bluebird';
var Promise = require("bluebird");
let CONF = require('../config/configuration.json');
const Knex = require('knex')
const util = require('util');

console.log("migration started");
console.log("----------------------");
// let db = 'FeedWilliamHills';
Promise.map(Object.keys(CONF.Databases), db => {
  const Config = {
    host: CONF.Databases[db].postgres.host,
    user: CONF.Databases[db].postgres.user,
    password: CONF.Databases[db].postgres.password,
    database: CONF.Databases[db].postgres.database,
    port: CONF.Databases[db].postgres.port,
    ssl: CONF.Databases[db].postgres.ssl,
    Promise: Bluebird,
    max: 10
  };
  let knex = Knex({
    client: 'postgresql',
    connection: {
      host: Config.host,
      user: Config.user,
      password: Config.password,
      database: 'postgres',
      charset: 'utf8'
    }
  });
  console.log("%s: creating db ", Config.database);
  return knex.raw('DROP DATABASE IF EXISTS "' + Config.database + '";')
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      return knex.raw('CREATE DATABASE "' + Config.database + '";')
        .then(() => {
          let knex = Knex({
            client: 'postgresql',
            connection: {
              host: Config.host,
              user: Config.user,
              password: Config.password,
              database: Config.database,
              charset: 'utf8'
            }
          });
          console.log("%s: created", Config.database);
          console.log("%s: starting migrations", Config.database);
          return knex.migrate.latest({
            directory: util.format('./migrations/%s', Config.database)
          }).then(function () {
            console.log('%s: migrations complete', Config.database)
          })
        })
    })
}, { concurrency: 1 }).then(() => {
  console.log("----------------------");
  console.log("migration completeted");
  process.exit(0);
});