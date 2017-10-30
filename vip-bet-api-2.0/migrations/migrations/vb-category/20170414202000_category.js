exports.up = function (knex, Promise) {
  return knex.schema.createTable('category', function (t) {
    t.increments('id').primary();
    t.integer('type_id').notNullable();
    t.bigInteger('dict_id').notNullable();
    t.integer('parent_id').nullable();
    t.integer('status_id').notNullable().defaultTo(1);
    t.integer('order_id').nullable().defaultTo(0);
    t.foreign('type_id').references('category_type.id');
    t.foreign('dict_id').references('dictionary.id');
    t.foreign('parent_id').references('category.id');
    t.foreign('status_id').references('status.id');
  }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('category').catch(err => console.log(err))
};