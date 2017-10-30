exports.up = function (knex, Promise) {
    return knex.schema.alterTable('participant_mapping', function (t) {
        t.string("provider_league_id");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('participant_mapping', t => {
        t.dropColumn("provider_league_id");
    }).catch(err => console.log(err))
};