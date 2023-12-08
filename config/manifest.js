/**
 * Created by A on 7/18/17.
 */
"use strict";

const AppConfig = require("../config/app");
const HapiSwagger = require("hapi-swagger");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Jwt = require("@hapi/jwt");

const manifest = {
  server: {
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true,
    },
    port: process.env.PORT || 5001,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  },
  register: {
    plugins: [
      {
        plugin: Vision,
      },
      {
        plugin: Inert,
      },
      {
        plugin: Jwt,
        options: AppConfig.jwt.options,
      },
    ],
  },
};

if (AppConfig.documentation.enable) {
  manifest.register.plugins.push({
    plugin: HapiSwagger,
    options: AppConfig.documentation.options,
  });
  //
  //     if (AppConfig.documentation.options.documentationPage || AppConfig.documentation.options.swaggerUI) {
  //         manifest.registrations.push(
  //             {
  //                 plugin: {
  //                     register: 'inert',
  //                     options: {}
  //                 }
  //             },
  //             {
  //                 plugin: {
  //                     register: 'vision',
  //                     options: {}
  //                 }
  //             }
  //         );
  //     }
  // }
  //
  // if (AppConfig.logging.console.enable || AppConfig.logging.loggly.enable) {
  //     const loggingPlugins = {
  //         plugin: {
  //             register: 'good',
  //             options: {
  //                 reporters: {}
  //             }
  //         }
  //     };
  //
  //     if (AppConfig.logging.console.enable) {
  //         loggingPlugins.plugin.options.reporters.consoleReporter = [
  //             {
  //                 module: 'good-squeeze',
  //                 name: 'Squeeze',
  //                 args: AppConfig.logging.console.levels
  //             },
  //             {
  //                 module: 'good-console'
  //             }, 'stdout'
  //         ]
  //     }
  //
  //     if (AppConfig.logging.loggly.enable) {
  //         loggingPlugins.plugin.options.reporters.logglyReporter = [
  //             {
  //                 module: 'good-squeeze',
  //                 name: 'Squeeze',
  //                 args: AppConfig.logging.loggly.levels
  //             },
  //             {
  //                 module: 'good-loggly',
  //                 args: [
  //                     {
  //                         token: AppConfig.logging.loggly.token,
  //                         subdomain: AppConfig.logging.loggly.subdomain,
  //                         tags: AppConfig.logging.loggly.tags,
  //                         name: AppConfig.logging.loggly.name,
  //                         hostname: AppConfig.logging.loggly.hostname,
  //                         threshold: AppConfig.logging.loggly.threshold,
  //                         maxDelay: AppConfig.logging.loggly.maxDelay
  //                     }
  //                 ]
  //             }
  //         ]
  //     }
  //
  //     manifest.registrations.push(loggingPlugins);
}

module.exports = manifest;
