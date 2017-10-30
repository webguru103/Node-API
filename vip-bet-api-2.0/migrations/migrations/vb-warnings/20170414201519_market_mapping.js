exports.up = function (knex, Promise) {
    return knex.schema.createTable('market_mapping', function (t) {
        t.bigIncrements('id').primary();
        t.integer('provider_id').notNullable();
        t.text('provider_market_id').notNullable();
        t.text('provider_market_name').notNullable();
        t.text('provider_sport_id').notNullable();
        t.text('provider_sport_name').notNullable();
        t.foreign('provider_id').references('provider.id');
    }).then(() => {
        return knex.raw("create unique index market_mapping_idx on market_mapping(provider_id, provider_market_id, provider_sport_id)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('market_mapping').catch(err => console.log(err))
};