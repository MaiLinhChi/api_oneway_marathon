
"use strict";

const Model = require('../model/Bib')
const MUUID = require('uuid-mongodb')
const moment = require("moment");
const mUUID4 = MUUID.v4();

module.exports = {
    putById: (req) => {
        return Model.findOneAndUpdate({_id: req.params.id}, req.payload, {new: true})
    },
    getById: (req) => {
        return Model.findOne({UserName: req.params.id}).then(item => {
            return {
                item
            }
        })
    },
    get:  (req) => {
        const {keyword, status, email, marathons, price, fromDate, toDate, pageSize, pageIndex} = req.query
        const options = { role: {$ne: 'admin'}, UserName: {$ne: 'admin'}}
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
        const bib = await Model.find({distance: req.payload.distance, marathon: req.payload.marathon});
        const isHaving = await bib.find((item) => item.email === req.payload.email);
        if(isHaving) {
            if(isHaving) return {statusCode: 400, message: 'Email is existed !', errorCode: 'EMAIL_EXISTED'};
        }
        const model = new Model({
            email: req.payload.email,
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
            model.save().then(() => resolve({status: 200, message: "Register suscess"})).catch(e => {
                resolve({statusCode: 400, message: e.toString()})
            })
        })
    },
}


