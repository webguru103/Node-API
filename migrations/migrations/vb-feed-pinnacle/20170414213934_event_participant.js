exports.up = function (knex, Promise) {
    return knex.schema.createTable('event_participant', t => {
        t.text('participant_id').primary();
        t.bigInteger('map_id').notNullable();
        t.bigInteger('event_id').notNullable();
        t.foreign('event_id').references('event.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('event_participant').catch(err => console.log(err))
};