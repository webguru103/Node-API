exports.up = function (knex, Promise) {
    return knex.schema.alterTable('events', function (t) {
        t.bigInteger('league_status_id').notNullable().defaultTo(1);
        t.bigInteger('country_status_id').notNullable().defaultTo(1);
        t.bigInteger('sport_status_id').notNullable().defaultTo(1);
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('events', function (t) {
        t.dropColumn('league_status_id');
        t.dropColumn('country_status_id');
        t.dropColumn('sport_status_id');
    }).catch(err => console.log(err))
};