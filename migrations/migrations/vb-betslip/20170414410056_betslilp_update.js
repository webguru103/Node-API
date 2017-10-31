exports.up = function (knex, Promise) {
    return knex.schema.alterTable('betslip', function (t) {
        t.string('description');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('betslip', function (t) {
        t.dropColumn('description');
    }).catch(err => console.log(err))
};