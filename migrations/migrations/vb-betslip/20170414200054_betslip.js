exports.up = function (knex, Promise) {
    return knex.schema.createTable('betslip', function (t) {
        t.bigIncrements('id').primary();
        t.text('username').notNullable();
        t.dateTime('place_date').notNullable().defaultTo(knex.raw('now()'));
        t.integer('money_type').notNullable();
        t.integer('status').notNullable().defaultTo(1);
        t.decimal('amount').notNullable().defaultTo(1);
        t.foreign('status').references('status.id');
        t.foreign('money_type').references('money_type.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('betslip').catch(err => console.log(err))
};