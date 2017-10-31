exports.up = function (knex, Promise) {
  return knex.schema.alterTable('market_selection', function (t) {
    t.text('rule');
    t.text('cancel_rule');
  }).catch(err => { })
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('market_selection', function (t) {
    t.dropColumn('rule');
    t.dropColumn('cancel_rule');
  }).catch(err => { })
};