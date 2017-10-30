exports.up = function (knex, Promise) {
    return knex.schema.createTable('selection_mapping', function (t) {
        t.bigIncrements('id').primary();
        t.integer('provider_id').notNullable();
        t.text('provider_selection_id').notNullable();
        t.text('provider_selection_name').notNullable();
        t.text('provider_market_id').notNullable();
        t.text('provider_category_id').notNullable();
        t.bigInteger('system_selection_id').nullable();
        t.foreign('provider_id').references('provider.id');
    }).then(() => {
        return knex.raw("create unique index selection_mapping_idx on selection_mapping(provider_id, provider_selection_id, provider_market_id, provider_category_id)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('selection_mapping').catch(err => console.log(err))
};