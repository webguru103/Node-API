exports.up = function (knex, Promise) {
    return knex.raw(`
    update users set status_id=1;
    alter table users alter column status_id set default 1;`)
};

exports.down = function (knex, Promise) {
    return knex.raw(`
    update users set status_id = null;
    alter table users alter column status_id drop default;
    `)
};