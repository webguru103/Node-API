exports.up = function (knex, Promise) {
	return knex.schema.alterTable('market_selection', function (t) {
		t.string('name');
	}).then(() => {
		return knex.raw(`create unique index selection_idx on market_selection(market_id, name)`)
	}).catch(err => { })
};

exports.down = function (knex, Promise) {
	return knex.raw(`drop index selection_idx`).then(() => {
		return knex.schema.alterTable('market_selection', function (t) {
			t.dropColumn('name');
		})
	}).catch(err => console.log(err))
};