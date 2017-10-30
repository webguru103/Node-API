exports.up = function (knex, Promise) {
    return knex.schema.createTable('statistic_type', function (t) {
        t.increments('id').primary();
        t.bigInteger('sport_id');
        t.string('name');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('statistic_type').catch(err => console.log(err))
};