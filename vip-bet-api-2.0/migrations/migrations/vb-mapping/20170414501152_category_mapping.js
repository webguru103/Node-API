exports.up = function (knex, Promise) {
  return knex.schema.alterTable('category_mapping', function (t) {
    t.integer('provider_category_status_id').notNullable().defaultTo(1);
  }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('category_mapping', function (t) {
    t.dropColumn('provider_category_status_id');
  }).catch(err => console.log(err))
};