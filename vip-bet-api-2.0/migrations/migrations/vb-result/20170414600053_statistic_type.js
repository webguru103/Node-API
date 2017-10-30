exports.up = function (knex, Promise) {
    return knex.schema.alterTable('statistic_type', function (t) {
        t.integer('order_id').notNullable().defaultTo(0);
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('statistic_type', function (t) {
        t.dropColumn('order_id');
    }).catch(err => console.log(err))
};