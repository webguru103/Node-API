exports.up = function (knex, Promise) {
    return knex.schema.createTable('provider', function (t) {
        t.increments('id').primary();
        t.text('name').notNullable();
    }).then(() => {
        return knex.batchInsert("provider", [
            { name: 'ladbrokes' },
            { name: "redKings" },
            { name: "myBet" },
            { name: "sbTech" },
            { name: "williamHills" }]);
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('provider').catch(err => console.log(err))
};