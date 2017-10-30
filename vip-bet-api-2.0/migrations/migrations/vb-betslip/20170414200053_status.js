exports.up = function (knex, Promise) {
    return knex.schema.createTable('status', function (t) {
        t.increments('id').notNullable();
        t.string('name').notNullable();
    }).then(() => {
        return knex.batchInsert("status", [
            { name: 'active' },
            { name: "lost" },
            { name: "won" },
            { name: "halfWon" },
            { name: "cancelled" }]);
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('status').catch(err => console.log(err))
};