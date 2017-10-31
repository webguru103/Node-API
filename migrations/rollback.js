"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
var Promise = require("bluebird");
let CONF = require('../config/configuration.json');
const Knex = require('knex');
const util = require('util');
console.log("migration started");
console.log("----------------------");
// let db = 'Betslip';
if (process.argv[2]) {
    let db = process.argv[2];
    if (!CONF.Databases[db]) {
        console.log("database not found");
        process.exit(1);
    }
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
    migrateDB(Config).then(() => {
        console.log("----------------------");
        console.log("migration completeted");
        process.exit(0);
    });
}
else {
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
        return migrateDB(Config);
    }, { concurrency: 1 }).then(() => {
        console.log("----------------------");
        console.log("migration completeted");
        process.exit(0);
    });
}
function migrateDB(Config) {
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
    console.log("%s: updating migrations", Config.database);
    return knex.migrate.rollback({
        directory: util.format('./migrations/%s', Config.database)
    }).then(function () {
        console.log('%s: migrations complete', Config.database);
    });
}
//# sourceMappingURL=rollback.js.map