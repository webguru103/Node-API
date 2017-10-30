exports.up = function (knex, Promise) {
  return knex.schema.createTable('participant', function (t) {
    t.bigIncrements('id').primary();
    t.bigInteger('dict_id').notNullable();
    t.integer('sport_id').notNullable();
    t.string('icon_url').nullable();
    t.foreign('dict_id').references('dictionary.id');
  }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('participant').catch(err => console.log(err))
};