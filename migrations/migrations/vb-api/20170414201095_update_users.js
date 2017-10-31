exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.string('username');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('username');
    }).catch(err => console.log(err))
};