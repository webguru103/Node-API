exports.up = function (knex, Promise) {
    return knex.schema.alterTable('provider', t => {
        t.integer('order_id').defaultTo(0);
    }).catch(err => { console.log(err); })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('provider', t => {
        t.dropColumn('order_id');
    }).catch(err => { console.log(err) })
};