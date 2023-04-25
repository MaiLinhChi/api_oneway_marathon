
"use strict";

const Model = require('../model/Bib')
const moment = require("moment");
const {vnpayPaymentMethod} = require("../utils/payment");

module.exports = {
    putById: async (req) => {
        if(req.payload.bankCode) {
            const comfirmed = await Model.findOne({_id: req.params.id});
            if(comfirmed.status === "comfirmed") {
                return {
                    message: "Order already confirmed",
                    status: 400
                }
            }
            const url = vnpayPaymentMethod('dev', req.payload.bankCode, req.payload.price, req.params.id, '127.0.0.1');
            req.payload.txnRef = url.vnp_TxnRef;
            req.payload.status = "processing";
            return Model.findOneAndUpdate({_id: req.params.id}, req.payload, {new: true}).then(item => {
                return {
                    data: item,
                    url,
                    status: 200
                }
            })
        }
        return Model.findOneAndUpdate({_id: req.params.id}, req.payload, {new: true})
    },
    getById: (req) => {
        return Model.findOne({_id: req.params.id}).then(item => {
            return {
                data: item,
                status: 200
            }
        })
    },
    get:  (req) => {
        const {keyword, status, email, marathons, price, fromDate, toDate, pageSize, pageIndex} = req.query
        const options = {}
        const keywordCondition = keyword ? { $or:[
            { username: { $regex: keyword, $options: 'i'} },
            { mobile: { $regex: keyword, $options: 'i'} },
            { email: { $regex: keyword, $options: 'i'} },
            { name: { $regex: keyword, $options: 'i'} },         
        ]} : {} 
        const skip =  pageIndex - 1 || 0
        const limit = pageSize || 20
        const sort = req.query.sort || 'asc'

        if(status) options.status = status
        if(email) options.email = { $regex: new RegExp(req.query.Name), $options: 'i' }
        if(marathons) options.marathons = marathons
        if(price) options.price = price
        // if(fromDate && toDate) options.CreatedOn = {$gte: new Date(fromDate), $lte: new Date(toDate)}
        if(fromDate || toDate) options.CreatedOn = {}
        if(fromDate) options.CreatedOn.$gte =  new Date(moment(fromDate,'DD/MM/YYYY').format("MM/DD/YYYY"))
        if(toDate) options.CreatedOn.$lte =  new Date(moment(toDate, 'DD/MM/YYYY').format("MM/DD/YYYY"))
        
        return Model.find({$and: [options, keywordCondition]}).limit(limit).skip(skip * limit).sort({
            CreatedOn: sort
        }).then(async rs => {
            const totalRecord = await Model.countDocuments({$and: [options, keywordCondition]})
            const newRes = rs.map(r=>{
                const {...res} = r._doc
                return {
                ...res,
                }
            })
            return {
                totalRecord,
                totalPaging: Math.ceil(totalRecord / limit),
                data: newRes
            }
        })
    },
    post: async (req) => {
        const bib = await Model.find({marathon: req.payload.marathon});
        const isHaving = bib.find((item) => item.email === req.payload.email || item.phone === req.payload.phone || item.passport === req.payload.passport);
        if(isHaving && isHaving.email === req.payload.email) {
            return {statusCode: 400, message: 'Email is existed !', errorCode: 'EMAIL_EXISTED'};
        } else if(isHaving && isHaving.phone === req.payload.phone) {
            return {statusCode: 400, message: 'Phone is existed !', errorCode: 'PHONE_EXISTED'};
        } else if(isHaving && isHaving.passport === req.payload.passport) {
            return {statusCode: 400, message: 'Passport is existed !', errorCode: 'PASSPORT_EXISTED'};
        }
        const model = new Model({
            email: req.payload.email,
            state: req.payload.state,
            marathon: req.payload.marathon,
            price: req.payload.price,
            distance: req.payload.distance,
            fullName: req.payload.fullName,
            birthday: req.payload.birthday,
            gender: req.payload.gender,
            nationality: req.payload.nationality,
            passport: req.payload.passport,
            phone: req.payload.phone,
            address: req.payload.address,
            emergencyContactName: req.payload.emergencyContactName,
            emergencyContactPhone: req.payload.emergencyContactPhone,
            shirtSize: req.payload.shirtSize,
            nameBib: req.payload.nameBib,
            timeEstimation: req.payload.timeEstimation,
        })
        return new Promise(resolve => {
            model.save().then((obj) => resolve({status: 200, message: "Register suscess", data: obj})).catch(e => {
                resolve({statusCode: 400, message: e.toString()})
            })
        })
    },
}


