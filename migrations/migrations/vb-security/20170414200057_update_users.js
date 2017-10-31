exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.text('facebook_token').nullable();
        t.text('linkedin_token').nullable();
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', function (t) {
        t.dropColumn('facebook_token');
        t.dropColumn('linkedin_token');
    }).catch(err => console.log(err));
};