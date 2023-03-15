const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : process.env.MYSQL_HOST || '127.0.0.1',
        user : process.env.MYSQL_USER || 'root',
        password : process.env.MYSQL_PW || '',
        database : process.env.MYSQL_DB || 'dbwallet',
        port : process.env.MYSQL_PORT || '3307',
    },
    // debug: ['ComQueryPacket']
});

module.exports = knex