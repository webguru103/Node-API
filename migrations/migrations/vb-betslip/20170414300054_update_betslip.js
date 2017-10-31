exports.up = function (knex, Promise) {
    return knex.schema.alterTable('betslip', function (t) {
        t.dropColumn('username');
        t.bigInteger('user_id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('betslip', function (t) {
        t.text('username');
        t.dropColumn('user_id');
    }).catch(err => console.log(err))
};