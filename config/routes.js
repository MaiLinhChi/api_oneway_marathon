/**
 * Created by A on 7/18/17.
 */
'use strict';
const Pac = require('../package.json');
const User = require('../route/User');

module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      tags: ['api', 'General'],
      description: 'access home',
      handler: (req, res) => {
        return res.response('Welcome to ' + Pac.name + ' !!!').code(200);
      }
    }
  },
  { method: 'GET', path: '/me', config: User.getMe },

    { method: 'POST', path: '/authenticate', config : User.postAuthenticate},
    { method: 'POST', path: '/admin/authenticate', config : User.postAuthenticateAdmin},
    { method: 'POST', path: '/users', config : User.post},
    { method: 'POST', path: '/users/password/forgot', config : User.postPasswordForgot},
    { method: 'PUT', path: '/users/password/forgot', config : User.putPasswordForgot},
    { method: 'GET', path: '/admin/users', config : User.get},
    { method: 'GET', path: '/users/{id}', config : User.getById},
    { method: 'PUT', path: '/password', config : User.putPassword},

];
