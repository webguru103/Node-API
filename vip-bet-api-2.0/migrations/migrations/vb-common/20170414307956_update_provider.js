exports.up = function (knex, Promise) {
    return knex.raw(`
    update provider_status set name = 'active' where id = 1;
    update provider_status set name = 'down' where id = 2;
    update provider_status set name = 'stopped' where id = 3;
    insert into provider_status(name) values('parsing');
    `).catch(err => { console.log(err); })
};

exports.down = function (knex, Promise) {
    return knex.raw(``).catch(err => { console.log(err) })
};