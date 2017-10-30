exports.up = function (knex, Promise) {
    return knex.schema.alterTable('event_result', t => {
        t.dropColumn('result');
        t.specificType('results', 'jsonb[]').notNullable();
    }).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('event_result', t => {
        t.specificType('result', 'jsonb[]').notNullable();
        t.dropColumn('results');
    }).catch(err => console.log(err));
};