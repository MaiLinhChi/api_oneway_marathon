const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.MARIADB_HOST || '127.0.0.1',
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PW || '',
    database: process.env.MARIADB_DB || '',
    port: process.env.MARIADB_PORT || '3307'
  }
  //   debug: ['ComQueryPacket']
});

module.exports = knex;
