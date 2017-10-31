exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_market', t => {
        t.text('id').primary();
        t.text('name').notNullable();
        t.bigInteger('map_id').notNullable();
        t.text('market_id').notNullable();
        t.string('event_id').notNullable();
        t.integer('status').notNullable();
        t.foreign('event_id').references('event.id');
        t.foreign('status').references('status.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_market').catch(err => console.log(err))
};