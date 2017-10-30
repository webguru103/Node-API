exports.up = function (knex, Promise) {
    return knex.schema.createTable('config_type', t => {
        t.increments('id').primary();
        t.text('name').notNullable();
    }).then(() => {
        return knex.batchInsert("config_type", [
            { name: 'default_provider' }]);
    }).catch(err => { })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('config_type').catch(err => console.log(err))
};