/**
 * Created by A on 7/18/17.
 */
'use strict';
const Pac = require('../package.json');
const User = require('../route/User');
const Marathon = require('../route/Marathon');
const Bib = require('../route/Bib');
const PaymentMethod = require('../route/PaymentMethod');

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

    { method: 'POST', path: '/marathons', config : Marathon.post},
    { method: 'GET', path: '/marathons', config : Marathon.get},
    { method: 'GET', path: '/marathons/{id}', config : Marathon.getById},
    { method: 'PUT', path: '/marathons/{id}', config : Marathon.putById},

    { method: 'POST', path: '/bib', config : Bib.post},
    { method: 'GET', path: '/bib', config : Bib.get},
    { method: 'GET', path: '/bib/{id}', config : Bib.getById},
    { method: 'PUT', path: '/bib/{id}', config : Bib.putById},

    { method: 'POST', path: '/payment-method', config : PaymentMethod.post},
    { method: 'GET', path: '/payment-method', config : PaymentMethod.get},
    { method: 'GET', path: '/payment-method/{id}', config : PaymentMethod.getById},
    { method: 'PUT', path: '/payment-method/{id}', config : PaymentMethod.putById},
];
