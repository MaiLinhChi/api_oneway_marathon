/**
 * Created by A on 7/18/17.
 */
'use strict';

const jwt       = require('@hapi/jwt')
const AppConfig = require('../config/app');
const parse = require('parse-duration')
function createToken({user}) {
    // console.log(user)
    let scopes;
    // Check if the user object passed in
    // has admin set to true, and if so, set
    // scopes to admin
    if (user.admin) {
        scopes = 'admin';
    }
    if (user.admin_cs) {
        scopes = 'admin_cs';
    }
    if (user.partner) {
        scopes = 'partner';
    }
    if (user.partner_cs) {
        scopes = 'partner_cs';
    }
    if (user.agent) {
        scopes = 'agent';
    }
    if (user.agent_cs) {
        scopes = 'agent_cs';
    }
    if (user.staff) {
        scopes = 'staff';
    }
    // Sign the JWT
    user.lotto97PCL = {}
    const token = jwt.token.generate({
            aud: 'urn:audience:prod',
            iss: 'urn:issuer:prod',
            user,
            scope: scopes,
        },
        {
            key: AppConfig.jwt.secret,
            algorithm: 'HS512'
        },
        {
            ttlSec: Number(AppConfig.jwt.expiresIn)
        })
    return token
}

module.exports = createToken;