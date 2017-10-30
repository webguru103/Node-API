exports.up = function (knex, Promise) {
    return knex.raw(`alter table event_selection alter column argument set default '0.00'`).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.raw(`alter table event_selection alter column argument drop default`).catch(err => console.log(err));
};