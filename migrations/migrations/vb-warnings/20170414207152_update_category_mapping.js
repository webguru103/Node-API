exports.up = function (knex, Promise) {
  return knex.schema.alterTable('category_mapping', t => {
    t.integer("category_type").notNullable();
  }).then(() => {
    return knex.raw('create unique index category_map_idx on category_mapping (provider_id, provider_category_id, category_type)')
  }).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
  return knex.raw('drop index category_map_idx').then(() => {
    return knex.schema.alterTable('category_mapping', t => {
      t.dropColumn("category_type");
    })
  }).catch(err => console.log(err));
};