exports.up = function (knex, Promise) {
  return knex.raw(`create index event_selection_idx_2 on event_selection_mapping(provider_event_selection_id);`).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.raw(`drop index event_selection_idx_2;`).catch(err => console.log(err))
};