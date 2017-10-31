exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_actions', function (t) {
        t.bigIncrements('id').primary();
        t.bigInteger('user_id');
        t.string('action');
        t.dateTime('date');
        t.string('ip');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_actions').catch(err => console.log(err))
};