exports.up = function (knex, Promise) {
    return knex.schema.alterTable('betslip', function (t) {
        t.decimal('won_amount').notNullable().defaultTo(1);
        t.decimal('possible_won_amount').notNullable().defaultTo(0);
        t.integer('type_id').notNullable();
        t.foreign('type_id').references("betslip_type.id");
    }).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('betslip', function (t) {
        t.dropColumn('won_amount');
        t.dropColumn('possible_won_amount');
        t.dropForeign("type_id");
        t.dropColumn('type_id');
    }).catch(err => console.log(err));
};