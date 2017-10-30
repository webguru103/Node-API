exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_market', t => {
        t.bigIncrements('id').primary();
        t.bigInteger('market_id').notNullable();
        t.bigInteger('event_id').notNullable();
        t.integer('status').notNullable().defaultTo(1);
        t.foreign('status').references('status.id');
    }).then(() => {
        return knex.raw("create unique index event_market_idx on event_market(market_id,event_id)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_market').catch(err => console.log(err))
};