
"use strict";

const Model = require('../model/User');
const { hashPassword } = require('../utils/userFunctions');
const bcrypt = require('bcrypt');

module.exports = {
    postManager: async (req) => {
        const {username, password} = req.payload
        const user = await Model.findOne({
            username
        });
        if(user) return {statusCode: 400, message: 'Username existed'};

        return new Promise(resolve => {
            hashPassword(password, (err, hash) => {
                if (err) {
                    resolve({statusCode: 500, message: 'server.error'})
                }
                const model = new Model({
                    username,
                    password: hash,
                    role: 'manager'
                })
                model.save().then(resolve).catch(e => {
                    resolve({ msg: e.toString() })
                });
            });
        })

    },
    postStaff: async (req) => {
        const {username, password} = req.payload
        const user = await Model.findOne({
            username
        });
        if(user) return {statusCode: 400, message: 'Username existed'};

        return new Promise(resolve => {
            hashPassword(password, (err, hash) => {
                if (err) {
                    resolve({statusCode: 500, message: 'server.error'})
                }
                const model = new Model({
                    username,
                    password: hash,
                    role: 'staff'
                })
                model.save().then(resolve).catch(e => {
                    resolve({ msg: e.toString() })
                });
            });
        })

    },
}


