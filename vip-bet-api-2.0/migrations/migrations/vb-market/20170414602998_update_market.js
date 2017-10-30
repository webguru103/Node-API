exports.up = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.boolean('multi_winner').notNullable().defaultTo(false);
  }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.dropColumn('multi_winner');
  }).catch(err => console.log(err))
};