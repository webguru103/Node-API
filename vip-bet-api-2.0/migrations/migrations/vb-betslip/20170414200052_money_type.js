exports.up = function (knex, Promise) {
    return knex.schema.createTable('money_type', function (t) {
        t.increments('id').notNullable();
        t.string('name').notNullable();
    }).then(() => {
        return knex.batchInsert("money_type", [
            { name: 'real_money' },
            { name: 'virtual_money' },
            { name: "tipster" }]);
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('money_type').catch(err => console.log(err))
};