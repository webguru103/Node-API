exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_type', t => {
        t.increments('id').primary();
        t.text('name').notNullable();
    }).then(() => {
        return knex.batchInsert("event_type", [
            { name: 'prematch' },
            { name: 'live' },
            { name: 'virtual' }]);
    }).catch(err => { })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_type').catch(err => console.log(err))
};