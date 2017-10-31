exports.up = function (knex, Promise) {
    return knex.schema.alterTable('betslip_detail', function (t) {
        t.integer('status_id').defaultTo(1);
        t.foreign('status_id').references('status.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('betslip_detail', function (t) {
        t.dropColumn('status_id');
    }).catch(err => console.log(err));
};