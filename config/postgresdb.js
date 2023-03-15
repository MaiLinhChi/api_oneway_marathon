const knex = require('knex')({
    client: 'pg',
    searchPath: 'public',
    connection: {
        host : process.env.MYSQL_HOST || '127.0.0.1',
        user : process.env.MYSQL_USER || 'postgres',
        password : process.env.MYSQL_PW || 'postgres',
        database : process.env.MYSQL_DB || 'postgres',
        port : process.env.MYSQL_PORT || 5432
    },
    // debug: ['ComQueryPacket']
});
module.exports = knex