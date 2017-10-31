exports.up = function (knex, Promise) {
    return knex.schema.createTable('config', t => {
        t.text('value');
        t.integer('config_type_id').primary();
        t.foreign('config_type_id').references('config_type.id');
    }).then(() => {
        return knex.batchInsert("config", [{ value: 2, config_type_id: 1 }]);
    }).catch(err => { })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('config').catch(err => console.log(err))
};