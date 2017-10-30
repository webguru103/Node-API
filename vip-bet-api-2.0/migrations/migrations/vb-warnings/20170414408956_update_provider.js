exports.up = function (knex, Promise) {
    return knex.raw(`
    insert into provider(name) values('betAtHome');
    `).catch(err => { console.log(err); })
};

exports.down = function (knex, Promise) {
    return knex.raw(``).catch(err => { console.log(err) })
};