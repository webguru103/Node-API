exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', function (t) {
        t.bigIncrements('id').primary();
        t.text('username').notNullable();
        t.text('wordpress_id').nullable();
        t.text('wordpress_username').nullable();
        t.dateTime('registration_date').notNullable().defaultTo(knex.raw('now()'));
        t.string('password').nullable();
        t.integer('status').nullable();
        t.text('avatar_url').nullable();
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users').catch(err => console.log(err))
};