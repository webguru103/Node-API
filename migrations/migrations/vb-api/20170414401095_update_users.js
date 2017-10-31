exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dateTime('last_login');
        t.string('last_login_ip');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('last_login');
        t.dropColumn('last_login_ip');
    }).catch(err => console.log(err))
};