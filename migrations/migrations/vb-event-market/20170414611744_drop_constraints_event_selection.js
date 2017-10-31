exports.up = function (knex, Promise) {
    return knex.raw(`
    alter table event_selection drop constraint if exists "event_selection_event_market_id_foreign";
    alter table event_selection drop constraint if exists "event_selection_status_id_foreign";
      `).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw(``).catch(err => console.log(err))
};