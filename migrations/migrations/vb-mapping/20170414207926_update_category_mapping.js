exports.up = function (knex, Promise) {
    return knex.schema.alterTable('category_mapping', function (t) {
        t.string("provider_sport_id");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('category_mapping', t => {
        t.dropColumn("provider_sport_id");
    }).catch(err => console.log(err))
};