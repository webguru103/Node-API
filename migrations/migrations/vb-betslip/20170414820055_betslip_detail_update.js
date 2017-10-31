exports.up = function (knex, Promise) {
    return knex.schema.alterTable('betslip_detail', function (t) {
        t.string('sport_name');
        t.string('country_name');
        t.string('league_name');
        t.string('event_name');
        t.string('market_name');
        t.string('selection_name');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('betslip_detail', function (t) {
        t.dropColumn('sport_name');
        t.dropColumn('country_name');
        t.dropColumn('league_name');
        t.dropColumn('event_name');
        t.dropColumn('market_name');
        t.dropColumn('selection_name');
    }).catch(err => console.log(err));
};