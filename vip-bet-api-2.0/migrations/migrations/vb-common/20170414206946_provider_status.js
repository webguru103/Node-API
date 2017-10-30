exports.up = function (knex, Promise) {
    return knex.schema.createTable('provider_status', t => {
        t.increments('id').primary();
        t.text('name').notNullable();
    }).then(() => {
        return knex.batchInsert("provider_status", [
            { name: "active" },
            { name: "disabled" },
            { name: "running" }]);
    }).catch(err => { })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('provider_status').catch(err => console.log(err))
};