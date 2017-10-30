exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_selection', t => {
        t.bigIncrements('id').primary();
        t.bigInteger('event_market_id').notNullable();
        t.decimal('odd').notNullable();
        t.integer('status_id').notNullable().defaultTo(1);
        t.bigInteger('selection_id').notNullable();
        t.text('argument').notNullable();
        t.foreign('event_market_id').references('event_market.id');
        t.foreign('status_id').references('status.id');
    }).then(() => {
        return knex.raw("create unique index event_selection_idx on event_selection(event_market_id,selection_id,argument)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_selection').catch(err => console.log(err))
};