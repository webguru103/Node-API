exports.up = function (knex, Promise) {
    return knex.raw("create index market_map_id_market_cat_idx on market_mapping(provider_id, provider_market_id, provider_category_id)").catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw("drop index market_map_id_market_cat_idx").catch(err => console.log(err))
};