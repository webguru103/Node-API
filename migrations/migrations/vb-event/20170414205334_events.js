exports.up = function (knex, Promise) {
    return knex.schema.createTable('events', function (t) {
        t.bigIncrements('id').primary();
        t.dateTime('start_date').notNullable();
        t.specificType('participants', 'bigint[]').notNullable();
        t.bigInteger('league_id').notNullable();
        t.bigInteger('country_id').notNullable();
        t.bigInteger('sport_id').notNullable();
        t.bigInteger('dict_id').notNullable();
        t.integer('status').notNullable().defaultTo(1);
        t.integer('type_id').notNullable();
        t.foreign('dict_id').references('dictionary.id');
        t.foreign('type_id').references('event_type.id');
        t.foreign('status').references('status.id');
    }).then(() => {
        return knex.raw(`create unique index event_idx on events(start_date,participants)`);
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('events').catch(err => console.log(err))
};