exports.up = function (knex, Promise) {
  return knex.schema.alterTable('category', function (t) {
    t.string('icon_url').nullable();
  }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('category', function (t) {
    t.dropColumn('icon_url');
  }).catch(err => { console.log(err) })
};