exports.up = function(knex, Promise) {
  return knex.schema.createTable('dictionary', function(t) {
        t.bigIncrements('id').primary();
    }).catch(err => console.log(err))
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dictionary').catch(err=>console.log(err))
};