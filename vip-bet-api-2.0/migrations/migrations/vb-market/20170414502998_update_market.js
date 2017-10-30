exports.up = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.string('name');
  }).then(function () {
    return knex.raw(`
      update market 
      set name = subquery.name 
      from (select market.id, translations.translation as name from market, translations where market.dict_id = translations.dict_id and translations.lang_id = 1) as subquery
      where market.id = subquery.id
    `)
  }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('market', function (t) {
    t.dropColumn('name');
  }).catch(err => console.log(err))
};