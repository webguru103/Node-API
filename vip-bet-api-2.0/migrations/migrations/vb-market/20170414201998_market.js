exports.up = function(knex, Promise) {
  return knex.schema.createTable('market', function(t) {
        t.increments('id').primary();
        t.bigInteger('dict_id').notNullable();
        t.integer('category_id').notNullable();
        t.integer('order_id').notNullable().defaultTo(0);
        t.foreign('dict_id').references('dictionary.id');
    }).catch(err=>{})
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('market').catch(err=>console.log(err))
};