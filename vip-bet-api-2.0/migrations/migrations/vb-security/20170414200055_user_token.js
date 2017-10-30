exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_token', function (t) {
        t.bigIncrements('id').primary();
        t.bigInteger('user_id').notNullable();
        t.text('token').notNullable();
        t.text('scope').notNullable();
        t.text('expries_at').notNullable();
        t.foreign('user_id').references('users.id');
    }).then(() => {
        return knex.raw("create unique index user_token_idx on user_token(user_id, scope)");
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_token').catch(err => console.log(err))
};