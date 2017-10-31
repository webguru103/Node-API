exports.up = function (knex, Promise) {
    return knex.schema.alterTable('event_selection', t => {
        t.integer('result_type');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('event_selection', t => {
        t.dropIndex('result_type');
    }).catch(err => console.log(err))
};