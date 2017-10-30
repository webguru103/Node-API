update participant_mapping
set system_participant_id = subquery.system_participant_id
from (select part_map.id, part_map_2.system_participant_id from participant_mapping as part_map
                        join participant_mapping as part_map_2 on LOWER(trim(part_map.provider_participant_name)) = LOWER(trim(part_map_2.provider_participant_name))
                        join category_mapping as cat_map on cat_map.provider_category_id = part_map_2.provider_sport_id
                        join category_mapping as cat_map_2 on cat_map_2.provider_category_id = part_map.provider_sport_id
                        where part_map.provider_id <> part_map_2.provider_id
                        and part_map.system_participant_id is null
                        and part_map_2.system_participant_id is not null
                        and cat_map.system_category_id = cat_map_2.system_category_id) as subquery
where participant_mapping.id = subquery.id;