exports.up = function (knex, Promise) {
    return knex.raw("create unique index participant_idx on participant(sport_id, name)").catch(err => { console.log(err) });
};

exports.down = function (knex, Promise) {
    return knex.raw("drop index participant_idx").catch(err => { console.log(err) });
};