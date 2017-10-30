exports.up = function (knex, Promise) {
    return knex.raw("drop index if exists event_result_idx").then(() => {
        return knex.schema.alterTable('event_result', t => {
            t.dropForeign('scope_id');            
            t.dropColumn('scope_id');
        })
    }).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('event_result', t => {
        t.bigInteger('scope_id').notNullable();
        t.foreign('scope_id').references('scope.id');
    }).then(() => {
        return knex.raw("create unique index event_result_idx on event_result(id, scope_id)");
    }).catch(err => console.log(err));
};