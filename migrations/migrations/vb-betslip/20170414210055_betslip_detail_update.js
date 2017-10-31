exports.up = function (knex, Promise) {
    return knex.schema.alterTable('betslip_detail', function (t) {
        t.integer('status').notNullable().defaultTo(1);
        t.dateTime('place_date').notNullable().defaultTo(knex.raw('now()'));
        t.foreign('status').references('status.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('betslip_detail', function (t) {
        t.dropForeign("status");
        t.dropColumn('status');
        t.dropColumn('place_date');
    }).catch(err => console.log(err));
};