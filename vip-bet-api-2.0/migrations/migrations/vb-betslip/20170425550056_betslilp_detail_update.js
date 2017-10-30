exports.up = function (knex, Promise) {
    return knex.raw(`ALTER TABLE betslip_detail RENAME COLUMN result_type TO result_type_id`).catch(err => console.log(err));
};

exports.down = function (knex, Promise) {
    return knex.raw(`ALTER TABLE betslip_detail RENAME COLUMN result_type_id TO result_type`).catch(err => console.log(err));
};