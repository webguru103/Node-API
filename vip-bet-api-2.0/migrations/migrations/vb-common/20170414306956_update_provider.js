exports.up = function (knex, Promise) {
    return knex.schema.alterTable('provider', t => {
        t.dateTime('ping_date');
    }).catch(err => { console.log(err); })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('provider', t => {
        t.dropColumn('ping_date');
    }).catch(err => { console.log(err) })
};