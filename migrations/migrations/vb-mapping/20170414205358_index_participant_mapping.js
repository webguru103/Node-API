exports.up = function (knex, Promise) {
    return knex.raw("create index participant_mapping_idx_2 on participant_mapping(provider_id, provider_participant_id)").catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw("drop index participant_mapping_idx_2").catch(err => console.log(err))
};