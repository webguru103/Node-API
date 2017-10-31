exports.up = function (knex, Promise) {
    return knex.schema.alterTable('provider', t => {
        t.string('interval').notNullable().defaultTo("0 */3 * * *");
        t.string('icon_url');
    }).catch(err => { console.log(err); })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('provider', t => {
        t.dropColumn('interval');
        t.dropColumn('icon_url');
    }).catch(err => { console.log(err) })
};