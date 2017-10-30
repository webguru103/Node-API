exports.up = function (knex, Promise) {
    return knex.schema.createTable('status', function (t) {
        t.increments('id').primary();
        t.string('name').notNullable();
    }).then(() => {
        return knex.batchInsert("status", [
            { name: 'active' },
            { name: "inactive" }]);
    }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('status').catch(err => console.log(err))
};