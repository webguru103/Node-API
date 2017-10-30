const raw = `
ALTER TABLE tokens RENAME referer TO referrer;`

const raw_back = `
ALTER TABLE tokens RENAME referrer TO referer;`


exports.up = function (knex, Promise) {
    return knex.schema.raw(raw);
};

exports.down = function (knex, Promise) {
    return knex.raw(raw_back);
};