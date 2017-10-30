exports.up = function (knex, Promise) {
    return knex.schema.createTable('selection_rule', t => {
        t.bigInteger('id').primary();
        t.bigInteger('market_id').notNullable();
        t.text('rule');
        t.text('cancel_rule');
    }).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('selection_rule').catch(err => console.log(err))
};