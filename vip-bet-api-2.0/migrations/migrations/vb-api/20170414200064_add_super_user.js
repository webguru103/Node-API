const raw = `
INSERT INTO users (email, password_hash, user_roles) 
    VALUES
        ('sadmin@vip-bet.com','196d1eafec06f83d43136492d460343705913ef9bcef871912a28583d98ed3bed71d8bb6d505f758adfbfad92fd8590cbd54258c17392307ed7a37aeab3a86c3', ARRAY['user', 'admin']);
`

exports.up = function (knex, Promise) {
    return knex.schema.raw(raw);
};

exports.down = function (knex, Promise) {
    return knex.raw('');
};