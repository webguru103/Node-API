exports.up = function (knex, Promise) {
    return knex.schema.alterTable('provider', t => {
        t.foreign('status_id').references('provider_status.id');
    }).catch(err => { console.log(err); })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('provider', t => {
        t.dropForeign('status_id');
    }).catch(err => { console.log(err) })
};