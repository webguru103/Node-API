exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('last_login');
        t.dateTime('last_login_date');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('last_login_date');
        t.dateTime('last_login');
    }).catch(err => console.log(err))
};