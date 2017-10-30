exports.up = function (knex, Promise) {
    return knex.schema.createTable('participant_mapping', function (t) {
        t.bigIncrements('id').primary();
        t.integer('provider_id').notNullable();
        t.text('provider_participant_id').notNullable();
        t.text('provider_participant_name').notNullable();
        t.text('provider_sport_id').notNullable();
        t.text('provider_sport_name').notNullable();
        t.foreign('provider_id').references('provider.id');
    }).then(() => {
        return knex.raw("create unique index participant_mapping_idx on participant_mapping(provider_id, provider_participant_id, provider_sport_id)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('participant_mapping').catch(err => console.log(err))
};