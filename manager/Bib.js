
"use strict";

const Model = require('../model/Bib')
const PaymentMethodModel = require('../model/PaymentMethod')
const moment = require("moment");
const {vnpayPaymentMethod} = require("../utils/payment");

module.exports = {
    putById: async (req) => {
        const { bankCode } = req.payload
        const { id } = req.params
        const bib = await Model.findOne({_id: id}).lean()
        if (!bib) return {
            message: 'bib not found',
            status: false,
            statusCode: 400,
            messageKey: 'bib_not_found'
        }
        const { price } = bib
        if(bankCode) {
            const comfirmed = await Model.findOne({_id: id});
            if(comfirmed.status === "comfirmed") {
                return {
                    message: "Order already confirmed",
                    status: 400
                }
            }
            const url = vnpayPaymentMethod('dev', bankCode, price, id, '127.0.0.1');
            req.payload.txnRef = url.vnp_TxnRef;
            req.payload.status = "processing";
            return Model.findOneAndUpdate({_id: id}, req.payload, {new: true}).then(item => {
                return {
                    data: item,
                    url,
                    status: 200
                }
            })
        }
        if(req.payload.bib) {
            const order = await Model.findOne({_id: id});
            if(order.status !== "confirmed") return {status: 400, message: "Please confirmed order"};
            const isExitBib = await Model.findOne({bib: req.payload.bib});
            if(isExitBib) return {status: 400, message: "Bib was exit"};
            return Model.findOneAndUpdate({_id: id}, req.payload, {new: true}).then(item => {
                return {
                    data: item,
                    status: 200,
                    message: "Confinmed bib successfully"
                }
            })
        }
        return Model.findOneAndUpdate({_id: id}, req.payload, {new: true}).then(item => {
            return {
                data: item,
                status: 200,
                message: "Add order successfully"
            }
        })
    },
    getById: (req) => {
        return Model.findOne({_id: req.params.id}).then(item => {
            if(item) {
                return {
                    data: item,
                    status: 200
                }
            }
            return {
                message: "Not bib with id " + req.params.id,
                status: 400
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
        const skip =  pageIndex ? pageIndex - 1 : 0
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
    post: (req) => {
        // const bib = await Model.find({marathon: req.payload.marathon});
        // const isHaving = bib.find((item) => item.email === req.payload.email || item.phone === req.payload.phone || item.passport === req.payload.passport);
        // if(isHaving && isHaving.email === req.payload.email) {
        //     return {statusCode: 400, message: 'Email is existed !', errorCode: 'EMAIL_EXISTED'};
        // } else if(isHaving && isHaving.phone === req.payload.phone) {
        //     return {statusCode: 400, message: 'Phone is existed !', errorCode: 'PHONE_EXISTED'};
        // } else if(isHaving && isHaving.passport === req.payload.passport) {
        //     return {statusCode: 400, message: 'Passport is existed !', errorCode: 'PASSPORT_EXISTED'};
        // }
        const model = new Model({
            email: req.payload.email,
            // state: req.payload.state,
            marathon: req.payload.marathon,
            price: req.payload.price,
            // distance: req.payload.distance,
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


