exports.up = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.integer('status_id').notNullable().defaultTo(1);
  }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.dropColumn('status_id');
  }).catch(err => console.log(err))
};