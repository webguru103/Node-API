exports.up = function (knex, Promise) {
    return knex.schema.createTable('scope', function (t) {
        t.increments('id').primary();
        t.bigInteger('sport_id');
        t.string('name');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('scope').catch(err => console.log(err))
};