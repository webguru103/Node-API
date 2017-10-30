exports.up = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.boolean('is_tipster_default').notNullable().defaultTo(false);
    t.boolean('is_tipster').notNullable().defaultTo(false);
  }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.dropColumn('is_tipster_default');
    t.dropColumn('is_tipster');
  }).catch(err => console.log(err))
};