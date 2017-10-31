exports.up = function (knex, Promise) {
    return knex.batchInsert("status", [
        { name: 'closed' }]).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw("");
};