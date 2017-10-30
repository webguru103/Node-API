exports.up = function(knex, Promise) {
  return knex.schema.createTable('tipster_market', function(t) {
        t.integer('market_id').primary();
        t.boolean('is_tipster_default').notNullable();
        t.boolean('is_tipster').notNullable();
        t.foreign('market_id').references('market.id');
    }).catch(err=>{})
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tipster_market').catch(err=>console.log(err))
};