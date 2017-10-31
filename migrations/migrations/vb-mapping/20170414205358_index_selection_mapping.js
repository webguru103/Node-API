exports.up = function (knex, Promise) {
    return knex.raw("create index selection_mapping_idx_2 on selection_mapping(provider_id, provider_selection_id, provider_market_id, provider_category_id)").catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw("drop index selection_mapping_idx_2").catch(err => console.log(err))
};