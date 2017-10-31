exports.up = function (knex, Promise) {
  return knex.schema.alterTable('provider', t => {
    t.string('icon_small_url');
  }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('provider', function (t) {
    t.dropColumn('icon_small_url');
  }).catch(err => { console.log(err) })
};