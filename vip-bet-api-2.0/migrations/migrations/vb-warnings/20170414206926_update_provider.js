exports.up = function (knex, Promise) {
    return knex.batchInsert("provider", [
        { name: 'betfair' },
        { name: 'betway' },
        { name: "coral" },
        { name: "pinnacle" },
        { name: "bet365" },
        { name: "betsafe" },
        { name: "bwin" }
    ]).catch(err => { })
};

exports.down = function (knex, Promise) {
    return knex.schema.raw("delete from provider where name in ('betfair', 'betway', 'coral', 'pinnacle', 'bet365', 'betsafe', 'bwin')")
};