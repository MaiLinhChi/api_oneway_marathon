/**
 * Created by A on 7/18/17.
 */
'use strict';

const bcrypt = require('bcrypt');
const Model = require('../model/User');
const moment = require("moment");
const sendGrid = require('./sendgrid')
const countryCode = {
    vn: '84'
}

const hashPassword = (password, cb) => {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {
        if(!err){
            bcrypt.hash(password, salt, (err, hash) => {
                return cb(err, hash);
            });
        }

    });
}

const verifyCredentialsAdmin = (req, res) => {
    const { username, password } = req.payload;

    return Model.findOne({ username, role: {$ne: 'user'} }).then(user => {
        // console.log(user)
        if (user) {
            return new Promise((resolve) => {
                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) res(err);
                    if (isValid) {
                        resolve({user: {...user._doc, admin: 1}});
                    } else {
                        resolve({statusCode: 400, message: 'Invalid credentials!'})
                    }
                });
            })
        }
        return res.response({statusCode: 400, message: 'Invalid credentials!'})
    });
}
const verifyCredentials = (req, res) => {
    const { username, password } = req.payload;
    return Model.findOne({ $or: [{username: username}, {email: username, role: 'user'}]}).then(async user => {
        // console.log(user)
        if (user) {
            if (user.status === 'pending') {
                const code = Math.floor(1000 + Math.random() * 9000)
                const msg = {
                    to: user.email, // Change to your recipient
                    from: 'admin@onewaymarathon.com', // Change to your verified sender
                    subject: 'One Way register verify',
                    text: 'Your code to verify One Way account: ' + code,
                }
                await sendGrid.send(msg)
                await user.updateOne({
                    verifyEmail: code,
                    timeResendVerifyEmail: moment.utc().unix(),
                })
            }
            return new Promise((resolve) => {
                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) res.response({statusCode: 400, message: 'Incorrect Password!'});
                    // console.log(err)
                    if (isValid) {
                        resolve({user: {...user._doc}});
                    } else {
                        resolve({statusCode: 400, message: 'Invalid credentials!', messageKey: 'invalid_credentials'})
                    }
                });
            })
        }
        return res.response({statusCode: 400, message: 'Invalid credentials!', messageKey: 'invalid_credentials'})
    }).catch(e => {
        console.log(e.toString())
        return res.response({statusCode: 400, message: e.toString()})
    })
}
const randomIntFromInterval = (min, max) => { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}
const getTimeReset = () => {
    const timePeriod = [1, 9, 17]
    let createdAt = moment().format('YYYY-MM-DD 01:00:00')
    const h = moment().format('HH')
    if(Number(h) >= timePeriod[1]) createdAt = moment().format('YYYY-MM-DD 09:00:00')
    if(Number(h) >= timePeriod[2]) createdAt = moment().format('YYYY-MM-DD 17:00:00')
    return createdAt
}
module.exports = {
    countryCode,
    verifyCredentials,
    verifyCredentialsAdmin,
    hashPassword,
    randomIntFromInterval,
    getTimeReset,
}