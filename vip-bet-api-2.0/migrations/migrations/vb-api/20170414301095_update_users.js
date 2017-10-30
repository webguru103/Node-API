exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.string('wordpress_token');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('wordpress_token');
    }).catch(err => console.log(err))
};