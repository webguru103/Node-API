exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('last_login_date');
        t.dropColumn('last_login_ip');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dateTime('last_login_date');
        t.string('last_login_ip');
    }).catch(err => console.log(err))
};