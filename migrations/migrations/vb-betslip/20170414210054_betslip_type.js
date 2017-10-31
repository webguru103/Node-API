exports.up = function (knex, Promise) {
    return knex.schema.createTable('betslip_type', function (t) {
        t.increments('id').primary();
        t.string('name').notNullable();
    }).then(() => {
        return knex.batchInsert("betslip_type", [
            { name: 'single' },
            { name: "express" },
            { name: "system" }]);
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('betslip_type').catch(err => console.log(err));
};