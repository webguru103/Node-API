exports.up = function (knex, Promise) {
    return knex.raw("create index event_mapping_idx_2 on event_mapping(provider_id, provider_event_id)").catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw("drop index event_mapping_idx_2").catch(err => console.log(err))
};