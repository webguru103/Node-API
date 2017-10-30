exports.up = function (knex, Promise) {
    return knex.schema.createTable('logins', function (t) {
        t.bigInteger('user_id').notNullable();
        t.dateTime('date').notNullable();
        t.text('token').notNullable();
        t.foreign('user_id').references('users.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('logins').catch(err => console.log(err))
};