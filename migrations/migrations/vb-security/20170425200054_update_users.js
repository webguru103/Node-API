exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.string('first_name');
        t.string('last_name');
        t.date('birth');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('first_name');
        t.dropColumn('last_name');
        t.dropColumn('birth');
    }).catch(err => console.log(err))
};