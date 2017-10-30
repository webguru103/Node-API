exports.up = function (knex, Promise) {
  return knex.raw(`
      drop index if exists "event_mapping_provider_id_event_id";
      drop index if exists market_mapping_provider_id_market_id_category_id;
      drop index if exists "market_map_id_market_cat_idx";
      drop index if exists selection_mapping_provider_id_selection_id_market_id_category_i;
      drop index if exists selection_map_id_market_idx;
      drop index if exists participant_mapping_provider_id_provider_participant_id_index;
      alter table participant_mapping drop constraint if exists "participant_mapping_provider_id_foreign";        
      drop index if exists part_idx;
      reindex table event_mapping;
      reindex table selection_mapping;
      reindex table participant_mapping;
      reindex table market_mapping;
    `).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
  return knex.raw(``).catch(err => console.log(err))
};