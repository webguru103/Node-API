exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_logins', function (t) {
        t.bigInteger('user_id');
        t.dateTime('date');
        t.string('ip');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_logins').catch(err => console.log(err))
};