exports.up = function (knex, Promise) {
    return knex.raw(`alter table event_market rename column status to status_id;`).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw(`alter table event_market rename column status_id to status;`).catch(err => console.log(err))
};