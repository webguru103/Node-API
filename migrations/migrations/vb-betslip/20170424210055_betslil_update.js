exports.up = function (knex, Promise) {
    return knex.raw(`ALTER TABLE betslip ALTER COLUMN won_amount DROP DEFAULT`).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.raw(``).catch(err => console.log(err));
};