exports.up = function(knex, Promise) {
  return knex.schema.createTable('market_selection', function(t) {
        t.increments('id').primary();
        t.bigInteger('dict_id').notNullable();
        t.integer('market_id').notNullable();
        t.integer('row_index').nullable();
        t.integer('column_index').nullable();
        t.foreign('dict_id').references('dictionary.id');
    }).catch(err=>{})
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('market_selection').catch(err=>console.log(err))
};