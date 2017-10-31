exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_mapping', function (t) {
        t.bigIncrements('id').primary();
        t.integer('provider_id').notNullable();
        t.text('provider_event_id').notNullable();
        t.dateTime('start_date').notNullable();
        t.bigInteger('system_event_id').nullable(); 
        t.foreign('provider_id').references('provider.id');       
    }).then(() => {
        return knex.raw("create unique index event_mapping_idx on event_mapping(provider_id, provider_event_id)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_mapping').catch(err => console.log(err))
};