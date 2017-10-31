exports.up = function (knex, Promise) {
    return knex.schema.createTable('translations', t => {
        t.bigIncrements('id').primary();
        t.bigInteger('dict_id').notNullable();
        t.integer('lang_id').notNullable();
        t.text('translation').notNullable();
        t.foreign('dict_id').references('dictionary.id');
    }).then(() => {
        return knex.raw('create unique index translations_idx on translations(dict_id, lang_id)');
    }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('translations').catch(err => console.log(err))
};