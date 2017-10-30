exports.up = function (knex, Promise) {
    return knex.schema.alterTable('betslip', function (t) {
        t.string('title');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('betslip', function (t) {
        t.dropColumn('title');
    }).catch(err => console.log(err))
};