exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_result', t => {
        t.bigInteger('id').primary();
        t.bigInteger('scope_id').notNullable();
        t.specificType('result', 'jsonb[]').notNullable();
        t.foreign('scope_id').references('scope.id');
    }).then(() => {
        return knex.raw("create unique index event_result_idx on event_result(id, scope_id)");
    }).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_result').catch(err => console.log(err))
};