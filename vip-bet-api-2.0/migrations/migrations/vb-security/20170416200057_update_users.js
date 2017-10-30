exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.string('email').nullable();
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('email');
    }).catch(err => console.log(err));
};