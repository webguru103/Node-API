exports.up = function (knex, Promise) {
    return knex.schema.alterTable('participant', function (t) {
        t.string('name');
    }).catch(err => { console.log(err) })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('participant', function (t) {
        t.dropColumn('name');
    }).catch(err => { console.log(err) })
};