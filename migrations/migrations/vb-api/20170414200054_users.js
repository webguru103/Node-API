exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', function (t) {
        t.bigIncrements('id').primary();
        t.string('first_name');
        t.string('last_name');
        t.string('email');
        t.string('password_hash');
        t.string('salt');
        t.string('facebook_id');
        t.specificType('facebook_permissions', 'character varying[]');
        t.string('twitter_token');
        t.specificType('user_roles', 'character varying[]');
        t.string('avatar');
        t.string('verification_photo');
        t.string('linkedin_id');
        t.string('linkedin_token');
        t.string('state_id');
        t.date('state_id_issue_date');
        t.string('country');
        t.string('city');
        t.string('address');
        t.string('phone');
        t.string('gender');
        t.date('birth');
        t.string('utm');
        t.string('referer');
        t.string('wordpress_id');
        t.string('wordpress_username');
        t.integer('status_id');
        t.dateTime('created').notNullable().defaultTo(knex.raw('now()'));
        t.dateTime('updated');
        t.dateTime('deleted');
    }).then(() => {
        return knex.raw(`
    create unique index users_email_idx on users(email);
    create unique index users_wp_id_idx on users(wordpress_id);
    create unique index users_wp_username_idx on users(wordpress_username);
    `)
    }).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users').catch(err => console.log(err))
};