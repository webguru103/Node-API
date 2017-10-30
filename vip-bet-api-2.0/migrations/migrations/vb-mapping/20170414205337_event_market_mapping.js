exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_market_mapping', function (t) {
        t.bigIncrements('id').primary();
        t.integer('provider_id').notNullable();
        t.text('provider_event_market_id').notNullable();
        t.text('provider_event_id').notNullable();
        t.text('provider_market_id').notNullable();
        t.text('provider_sport_id').notNullable();
        t.bigInteger('system_event_market_id').nullable(); 
        t.foreign('provider_id').references('provider.id');       
    }).then(() => {
        return knex.raw("create unique index event_market_mapping_idx on event_market_mapping(provider_id, provider_event_market_id)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_market_mapping').catch(err => console.log(err))
};