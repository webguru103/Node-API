exports.up = function (knex, Promise) {
  return knex.raw(`create unique index market_udx on market(category_id, name)`).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.raw(`drop index market_udx`).catch(err => console.log(err))
};