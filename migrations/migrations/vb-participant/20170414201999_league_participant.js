exports.up = function (knex, Promise) {
    return knex.schema.createTable('league_participant', function (t) {
        t.integer('league_id');
        t.bigInteger('participant_id');
        t.integer('country_id').notNullable();
        t.foreign('participant_id').references('participant.id');
    }).then(() => {
        return knex.raw("create unique index league_participant_idx on league_participant(participant_id, league_id)");
    }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('league_participant').catch(err => console.log(err))
};