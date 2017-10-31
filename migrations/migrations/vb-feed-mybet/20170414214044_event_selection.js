exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_selection', t => {
        t.bigInteger('id').primary();
        t.text('name').notNullable();
        t.bigInteger('map_id').notNullable();
        t.text('event_market_id').notNullable();
        t.decimal('odd').notNullable();
        t.text('argument').notNullable();
        t.integer('status').notNullable();
        t.foreign('event_market_id').references('event_market.id');
        t.foreign('status').references('status.id');
    }).then(() => {
        return knex.raw("create unique index event_selection_idx on event_selection(event_market_id,name,argument)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_selection').catch(err => console.log(err))
};