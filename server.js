/**
 * Created by A on 7/18/17.
 */
'use strict'
require('dotenv').config()
require('colors');
require('./utils/seed');
// require('./config/mysqldb');
const Logger    = require('./utils/logging');
const Glue      = require('@hapi/glue');
const Routes    = require('./config/routes');
const Manifest  = require('./config/manifest');
const AppConfig = require('./config/app');
const mongoose = require("mongoose");
const parse = require('parse-duration')
const dbUrl = require("./config/mongodb")
const {port}      = Manifest.server

const startServer = async () => {
  try {
    mongoose.connect(dbUrl.connectString, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
      Logger.info('.------------------------------------------------.'.green);
      Logger.info(`|   Server running at: ${port}                      |`.green);
      Logger.info("|   Connect MongoDB success !!!                  |".green);
      Logger.info('|________________________________________________|'.green);
    }).catch(err => {
      console.log(err)
      Logger.error('.------------------------------------------------.'.green);
      Logger.error(`|   Server running at: ${port}   |`.green);
      Logger.error("|   Can't connect to MongoDB !!!                 |".red);
      Logger.error('|________________________________________________|'.green);
      Logger.error(err);
    });
    const server = await Glue.compose(Manifest, {relativeTo: __dirname})
    server.start();
    server.auth.strategy('jwt', 'jwt', {
      keys: AppConfig.jwt.secret,
      verify: {
        aud: 'urn:audience:prod',
        iss: 'urn:issuer:prod',
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: Number(AppConfig.jwt.expiresIn),
        timeSkewSec: 15
      },
      validate: (artifacts, request, h) => {
        return {
          isValid: true
        };
      }
    });
    server.route(Routes);
    server.events.on('response', (request) => {
      // request.response.headers['X-Frame-Options'] = 'DENY'
      if(request.response.statusCode <= 304) Logger.info((request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode).green);
      else Logger.error(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    });
    // server.ext({
    //     type: 'onPreResponse',
    //     method: (request, h) => {
    //         request.response.headers['X-Frame-Options'] = 'DENY'
    //         return h.continue;
    //     }
    // });
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
// Glue.compose(Manifest, {relativeTo: __dirname}, async (err, server) => {
//     if (err) {
//         throw err;
//     }
//     console.log(server)
//     server.start(() => {
//         mongoose.connect(dbUrl.connectString, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//             Logger.info('.------------------------------------------------.'.green);
//             Logger.info(`|   Server running at: ${port}                      |`.green);
//             Logger.info("|   Connect MongoDB success !!!                  |".green);
//             Logger.info('|________________________________________________|'.green);
//         }).catch(err => {
//             Logger.error('.------------------------------------------------.'.green);
//             Logger.error(`|   Server running at: ${port}   |`.green);
//             Logger.error("|   Can't connect to MongoDB !!!                 |".red);
//             Logger.error('|________________________________________________|'.green);
//             Logger.error(err);
//         });
//     });
//     server.auth.strategy('jwt', 'jwt', {
//         key: AppConfig.jwt.secret,
//         verifyOptions: { algorithms: ['HS256'] }
//     });
//     server.route(Routes);
//
// });