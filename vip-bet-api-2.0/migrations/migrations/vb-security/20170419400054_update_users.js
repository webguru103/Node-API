exports.up = function (knex, Promise) {
    return knex.raw(`
    alter table users rename column status to status_id;
    alter table users rename column password to password_hash;
    `).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw(`
    alter table users rename column status_id to status;
    alter table users rename column password_hash to password;`).catch(err => console.log(err))
};