
"use strict";

const { hashPassword } = require('../utils/userFunctions');
const bcrypt = require('bcrypt');
const Sendgrid = require('../utils/sendgrid')
const Model = require('../model/User')
const LogModel = require('../model/Logs')
const rp            = require('request-promise')
const MUUID = require('uuid-mongodb')
const moment = require("moment");
const mUUID4 = MUUID.v4();

const sendCodeVerify = (req, user) => {
    const code = Math.floor(1000 + Math.random() * 9000)
    const msg = {
        to: req.payload.email, // Change to your recipient
        from: 'admin@onewaymarathon.com', // Change to your verified sender
        subject: 'One Way register verify',
        text: 'Your code to verify One Way account: ' + code,
        // html: '',
    }
    return Sendgrid.send(msg).then(rs => {
        return Model.findOneAndUpdate({ _id: user._id }, { $set: {
                verifyEmail: code,
                verified: false,
                resendVerifyEmail: user.resendVerifyEmail + 1,
                timeResendVerifyEmail: moment.utc().unix(),
            }}, { new: true })
    }).then(rs => ({statusCode: 200, message: 'Please check email to get verify code !'}))
}
module.exports = {
    putPasswordForgot: (req) => {
        return 1
    },
    postPasswordForgot: (req) => {
       return 1

    },
    getById: (req) => {
        return Model.findOne({UserName: req.params.id}).then(item => {
            return {
                item
            }
        })
    },
    get:  (req) => {
        const {keyword, status, Name, PhoneNumber, Email, UserName, fromDate, toDate, pageSize, pageIndex} = req.query
        const options = { role: {$ne: 'admin'}, UserName: {$ne: 'admin'}}
        const keywordCondition = keyword ? { $or:[
            { UserName: { $regex: keyword, $options: 'i'} },
            { PhoneNumber: { $regex: keyword, $options: 'i'} },
            { Email: { $regex: keyword, $options: 'i'} },
            { Name: { $regex: keyword, $options: 'i'} },         
        ]} : {} 
        const skip =  pageIndex - 1 || 0
        const limit = pageSize || 20
        const sort = req.query.sort || 'asc'

        if(status) options.status = status
        if(Name) options.Name = { $regex: new RegExp(req.query.Name), $options: 'i' }
        if(UserName) options.UserName = UserName
        if(PhoneNumber) options.PhoneNumber = PhoneNumber
        if(Email) options.Email = Email
        // if(fromDate && toDate) options.CreatedOn = {$gte: new Date(fromDate), $lte: new Date(toDate)}
        if(fromDate || toDate) options.CreatedOn = {}
        if(fromDate) options.CreatedOn.$gte =  new Date(moment(fromDate,'DD/MM/YYYY').format("MM/DD/YYYY"))
        if(toDate) options.CreatedOn.$lte =  new Date(moment(toDate, 'DD/MM/YYYY').format("MM/DD/YYYY"))
        console.log(new Date(moment(fromDate,'DD/MM/YYYY').format("MM/DD/YYYY")))
        console.log(new Date(moment(toDate,'DD/MM/YYYY').format("MM/DD/YYYY")))
        
        return Model.find({$and: [options, keywordCondition]}).limit(limit).skip(skip * limit).sort({
            CreatedOn: sort
        }).then(async rs => {
            const totalRecord = await Model.countDocuments({$and: [options, keywordCondition]})
            const newRes = rs.map(r=>{
                const {_id, ...res} = r._doc
                return {
                ...res,
                userId:  mUUID4.toString(_id)
                }
            })
            return Response.resOK({
                totalRecord,
                totalPaging: Math.ceil(totalRecord / limit),
                data: newRes
            },true)
        })
    },
    post: async (req) => {
        const user = await Model.findOne({email: req.payload.email});
        if(user) {
            if(user.verified && user.username) return {statusCode: 400, message: 'email is existed !', errorCode: 'EMAIL_EXISTED'};
            // return sendCodeVerify(req, user)
        }
        return new Promise(resolve => {

            hashPassword(req.payload.password, (err, hash) => {
                if (err) {
                    resolve({statusCode: 400, message: err.toString()})
                } else {
                    req.payload.password = hash;
                    req.payload.updatedBy = 'register';
                    const model = new Model(req.payload)
                    model.save().then(resolve).catch(e => {
                        resolve({statusCode: 400, message: e.toString()})
                    })
                }
            });
        })

    },
    getMe: (req) => {
        return Model.findOne({UserName: req.auth.credentials.user.UserName})
    },
    putPassword: async (req) => {
        const user = await Model.findOne({
            username: req.auth.credentials.user.username
        });
        const { oldPassword, newPassword } = req.payload;

        // compare
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (isMatch) {
            // update
            return new Promise(resolve => {
                hashPassword(newPassword, (err, hash) => {
                    if (err) {
                        resolve({statusCode: 500, message: 'server.error'})
                    }
                    user.password = hash;
                    user.updatedBy = req.auth.credentials.user.username;
                    // console.log(req.auth.credentials.user, user)
                    user.save().then(resolve).catch(e => {
                        return { msg: e.toString() }
                    });
                });
            })
        }
            return {statusCode: 400, message: 'Invalid credential'};

    },
}


