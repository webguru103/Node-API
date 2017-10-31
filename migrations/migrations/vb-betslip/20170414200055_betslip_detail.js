exports.up = function (knex, Promise) {
    return knex.schema.createTable('betslip_detail', function (t) {
        t.bigIncrements('id').primary();
        t.bigInteger('betslip_id').notNullable();
        t.bigInteger('event_id').notNullable();
        t.bigInteger('event_market_id').notNullable();
        t.bigInteger('event_selection_id').notNullable();
        t.bigInteger('market_id').notNullable();
        t.bigInteger('selection_id').notNullable();        
        t.integer('sport_id').notNullable();
        t.integer('country_id').notNullable();
        t.integer('league_id').notNullable();
        t.boolean('is_lobby').notNullable().defaultTo(false);
        t.integer('group').notNullable().defaultTo(0);
        t.decimal('odd').notNullable().defaultTo(0);
        t.integer('provider_id').notNullable();
        t.foreign('betslip_id').references('betslip.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('betslip_detail').catch(err => console.log(err))
};