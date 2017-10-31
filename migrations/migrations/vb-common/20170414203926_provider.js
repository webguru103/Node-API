exports.up = function (knex, Promise) {
    return knex.schema.createTable('provider', t => {
        t.increments('id').primary();
        t.text('name').notNullable();
        t.integer('status_id').notNullable().defaultTo(1);
    }).then(() => {
        return knex.batchInsert("provider", [
            { name: 'ladbrokes' },
            { name: "redKings" },
            { name: "myBet" },
            { name: "sbTech" },
            { name: "williamHills" }]);
    }).catch(err => { })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('provider').catch(err => console.log(err))
};