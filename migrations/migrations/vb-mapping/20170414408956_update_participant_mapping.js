exports.up = function (knex, Promise) {
    return knex.raw(`
    create index part_idx on participant_mapping(provider_sport_id,provider_participant_name);
    `).catch(err => { console.log(err); })
};

exports.down = function (knex, Promise) {
    return knex.raw(`drop index part_idx;`).catch(err => { console.log(err) })
};