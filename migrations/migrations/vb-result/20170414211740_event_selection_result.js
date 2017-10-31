exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_selection_result', t => {
        t.bigInteger('id').primary();
        t.bigInteger('selection_id').notNullable();
        t.integer('result_type_id');
    }).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_selection_result').catch(err => console.log(err))
};