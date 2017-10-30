exports.up = function (knex, Promise) {
    return knex.schema.createTable('event', t => {
        t.string('id').primary();
        t.string('name').notNullable();
        t.dateTime('start_date').notNullable();
        t.bigInteger('map_id').notNullable();
        t.string('sport_id').notNullable();
        t.string('country_id').notNullable();
        t.string('league_id').notNullable();
        t.integer('status').notNullable();
        t.integer('type_id').notNullable();
        t.foreign("sport_id").references('category.id');
        t.foreign("country_id").references('category.id');
        t.foreign("league_id").references('category.id');
        t.foreign('status').references('status.id');
        t.foreign('type_id').references('event_type.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event').catch(err => console.log(err))
};