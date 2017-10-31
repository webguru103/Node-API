exports.up = function (knex, Promise) {
    return knex.schema.createTable('tokens', function (t) {
        t.bigIncrements('id').primary();
        t.boolean('canceled');
        t.string('device');
        t.string('device_id');
        t.string('version');
        t.string('issuer');
        t.string('algorithms');
        t.string('user_id');
        t.specificType('permissions', 'character varying[]');
        t.string('utm');
        t.string('referer');
        t.dateTime('created').notNullable().defaultTo(knex.raw('now()'));
        t.dateTime('updated');
        t.dateTime('deleted');
        t.dateTime('expires');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('tokens').catch(err => console.log(err))
};