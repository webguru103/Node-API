exports.up = function (knex, Promise) {
    return knex.raw("create index event_market_mapping_idx_2 on event_market_mapping(provider_event_market_id, system_event_market_id)").catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw("drop index event_market_mapping_idx_2").catch(err => console.log(err))
};