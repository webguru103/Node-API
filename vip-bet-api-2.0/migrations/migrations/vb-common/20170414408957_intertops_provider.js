exports.up = function (knex, Promise) {
    return knex.raw(`
    insert into provider(name) values('intertops');
    `).catch(err => { console.log(err); })
};

exports.down = function (knex, Promise) {
    return knex.raw(``).catch(err => { console.log(err) })
};