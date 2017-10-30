exports.up = function (knex, Promise) {
    return knex.raw(`
    create unique index users_username_idx on users(username);
    create unique index users_email_idx on users(email);
    create unique index users_wp_id_idx on users(wordpress_id);
    create unique index users_wp_username_idx on users(wordpress_username);
    `).catch(err => console.log(err))
};

exports.down = function (knex, Promise) {
    return knex.raw(`
    drop index users_username_idx;
    drop index users_email_idx;
    drop index users_wp_id_idx;
    drop index users_wp_username_idx;
    `).catch(err => console.log(err));
};