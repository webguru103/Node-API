exports.up = function (knex, Promise) {
    return knex.schema.alterTable('user_logins', function (t) {
        t.bigIncrements('id').primary();
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('user_logins', function (t) {
        t.dropColumn('id');
    }).catch(err => console.log(err))
};