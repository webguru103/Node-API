exports.up = function (knex, Promise) {
    return knex.schema.createTable('category', t => {
        t.string('id').primary();
        t.string('name').notNullable();        
        t.integer('type_id').notNullable();
        t.bigInteger('map_id').notNullable();
        t.string('parent_id').nullable();
        t.foreign('parent_id').references('category.id');
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('category').catch(err => console.log(err))
};