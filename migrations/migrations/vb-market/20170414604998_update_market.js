exports.up = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.integer('scope_id');
    t.integer('statistic_type_id');
  }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.dropColumn('scope_id');
    t.dropColumn('statistic_type_id');
  }).catch(err => console.log(err))
};