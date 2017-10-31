exports.up = function (knex, Promise) {
  return knex.schema.createTable('category_mapping', function (t) {
    t.bigIncrements('id').primary();
    t.integer('provider_id').notNullable();
    t.text('provider_category_id').notNullable();
    t.text('provider_category_name').notNullable();
    t.text('provider_parent_category_name').nullable();
    t.foreign('provider_id').references('provider.id');
  }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('category_mapping').catch(err => console.log(err))
};