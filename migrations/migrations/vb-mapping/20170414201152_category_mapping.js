exports.up = function (knex, Promise) {
  return knex.schema.createTable('category_mapping', function (t) {
    t.bigIncrements('id').primary();
    t.integer('provider_id').notNullable();
    t.text('provider_category_id').notNullable();
    t.text('provider_category_name').notNullable();
    t.text('provider_parent_category_id').nullable();
    t.integer('category_type').notNullable();
    t.integer('system_category_id').nullable();
  }).then(() => {
    return knex.raw("create unique index category_mapping_idx on category_mapping(provider_id,provider_category_id,category_type)");
  }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('category_mapping').catch(err => console.log(err))
};