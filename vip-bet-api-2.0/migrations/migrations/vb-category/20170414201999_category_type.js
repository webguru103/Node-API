exports.up = function (knex, Promise) {
    return knex.schema.createTable('category_type', function (t) {
        t.increments('id').primary();
        t.string('name').notNullable();
    }).then(() => {
        return knex.batchInsert("category_type", [
            { name: 'sport' },
            { name: "country" },
            { name: "league" },
            { name: "subleague" }]);
    }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('category_type').catch(err => console.log(err))
};