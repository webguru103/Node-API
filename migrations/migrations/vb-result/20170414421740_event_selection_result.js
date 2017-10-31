exports.up = function (knex, Promise) {
    return knex.schema.alterTable('event_selection_result', t => {
        t.integer('event_id').notNullable();
        t.integer('event_market_id').notNullable();
    }).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('event_selection_result', t => {
        t.dropColumn('event_id');
        t.dropColumn('event_market_id');
    }).catch(err => console.log(err));
};